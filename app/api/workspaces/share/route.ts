// app/api/workspaces/share/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

async function getCurrentUserId(session: any) {
  if (!session) return null;
  if (session.user?.id) return session.user.id as string;
  if (session.user?.email) {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });
    return user?.id ?? null;
  }
  return null;
}

/**
 * POST /api/workspaces/share?id=<id>
 * body: { email }
 * Only workspace owner can share. If email belongs to existing user, connect them.
 * Returns updated workspace (with sharedWith included).
 */
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });

    const userId = await getCurrentUserId(session);
    if (!userId) return NextResponse.json({ error: "User not found" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing workspace id" }, { status: 400 });

    const numericId = Number(id);
    if (Number.isNaN(numericId)) return NextResponse.json({ error: "Invalid workspace id" }, { status: 400 });

    const body = await req.json();
    const email = String(body?.email ?? "").trim().toLowerCase();
    if (!email) return NextResponse.json({ error: "Email is required" }, { status: 400 });

    const workspace = await prisma.workspace.findUnique({ where: { id: numericId } });
    if (!workspace) return NextResponse.json({ error: "Workspace not found" }, { status: 404 });

    if (workspace.ownerId !== userId) {
      return NextResponse.json({ error: "Forbidden: only owner can share" }, { status: 403 });
    }

    // Find target user by email
    const targetUser = await prisma.user.findUnique({ where: { email } });

    if (!targetUser) {
      // You may want to implement invites instead of a hard error.
      return NextResponse.json({ error: "User with that email not found" }, { status: 404 });
    }

    // Add relation if not already present
    await prisma.workspace.update({
      where: { id: numericId },
      data: {
        sharedWith: {
          connect: { id: targetUser.id },
        },
      },
    });

    const updated = await prisma.workspace.findUnique({
      where: { id: numericId },
      include: { owner: { select: { id: true, email: true, name: true } }, sharedWith: { select: { id: true, email: true, name: true } } },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (err) {
    console.error("POST /api/workspaces/share error:", err);
    // handle unique constraint / already connected case gracefully
    return NextResponse.json({ error: "Failed to share workspace" }, { status: 500 });
  }
}

/**
 * DELETE /api/workspaces/share?id=<id>&email=<email>
 * Or accept body { email }.
 * Only owner can remove collaborator.
 */
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });

    const userId = await getCurrentUserId(session);
    if (!userId) return NextResponse.json({ error: "User not found" }, { status: 401 });

    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    const emailParam = url.searchParams.get("email");

    let email = emailParam ?? "";
    if (!email) {
      // try parse body
      try {
        const body = await req.json();
        email = String(body?.email ?? "").trim().toLowerCase();
      } catch {
        email = "";
      }
    }

    if (!id) return NextResponse.json({ error: "Missing workspace id" }, { status: 400 });
    if (!email) return NextResponse.json({ error: "Email is required" }, { status: 400 });

    const numericId = Number(id);
    if (Number.isNaN(numericId)) return NextResponse.json({ error: "Invalid workspace id" }, { status: 400 });

    const workspace = await prisma.workspace.findUnique({ where: { id: numericId } });
    if (!workspace) return NextResponse.json({ error: "Workspace not found" }, { status: 404 });

    if (workspace.ownerId !== userId) {
      return NextResponse.json({ error: "Forbidden: only owner can unshare" }, { status: 403 });
    }

    const targetUser = await prisma.user.findUnique({ where: { email } });
    if (!targetUser) return NextResponse.json({ error: "User with that email not found" }, { status: 404 });

    await prisma.workspace.update({
      where: { id: numericId },
      data: {
        sharedWith: {
          disconnect: { id: targetUser.id },
        },
      },
    });

    const updated = await prisma.workspace.findUnique({
      where: { id: numericId },
      include: { owner: { select: { id: true, email: true, name: true } }, sharedWith: { select: { id: true, email: true, name: true } } },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (err) {
    console.error("DELETE /api/workspaces/share error:", err);
    return NextResponse.json({ error: "Failed to unshare workspace" }, { status: 500 });
  }
}
