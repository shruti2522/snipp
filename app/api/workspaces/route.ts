// app/api/workspaces/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth"; // adjust path if needed

const prisma = new PrismaClient();

async function getCurrentUserId(session: any) {
  if (!session) return null;

  // Preferred: session.user.id (if you add it in callbacks)
  if (session.user?.id) return session.user.id as string;

  // Fallback: find user by email
  if (session.user?.email) {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });
    return user?.id ?? null;
  }

  return null;
}

// GET: list all workspaces for current user OR get one workspace by ?id=123
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    const userId = await getCurrentUserId(session);
    if (!userId) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      const workspaces = await prisma.workspace.findMany({
        where: { ownerId: userId },
        orderBy: { id: "desc" }, // or createdAt
      });
      return NextResponse.json(workspaces, { status: 200 });
    }

    const numericId = Number(id);
    if (Number.isNaN(numericId)) {
      return NextResponse.json({ error: "Invalid workspace id" }, { status: 400 });
    }

    const workspace = await prisma.workspace.findFirst({
      where: { id: numericId, ownerId: userId },
    });

    if (!workspace) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
    }

    return NextResponse.json(workspace, { status: 200 });
  } catch (error) {
    console.error("GET /api/workspaces error:", error);
    return NextResponse.json({ error: "Failed to fetch workspaces" }, { status: 500 });
  }
}

// POST: create new workspace for current user
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    const userId = await getCurrentUserId(session);
    if (!userId) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    const body = await req.json();
    const name = body?.name?.toString()?.trim();

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const workspace = await prisma.workspace.create({
      data: { name, ownerId: userId },
    });

    return NextResponse.json(workspace, { status: 201 });
  } catch (error) {
    console.error("POST /api/workspaces error:", error);
    return NextResponse.json({ error: "Failed to create workspace" }, { status: 500 });
  }
}

// PUT: update workspace by id (expects ?id=123 and body { name })
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    const userId = await getCurrentUserId(session);
    if (!userId) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const { name } = await req.json();

    if (!id || !name || !name.trim()) {
      return NextResponse.json({ error: "id and name are required" }, { status: 400 });
    }

    const numericId = Number(id);
    if (Number.isNaN(numericId)) {
      return NextResponse.json({ error: "Invalid workspace id" }, { status: 400 });
    }

    // Ensure the workspace exists and belongs to this user
    const existing = await prisma.workspace.findUnique({ where: { id: numericId } });

    if (!existing) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
    }

    if (existing.ownerId !== userId) {
      return NextResponse.json({ error: "Forbidden: not the owner" }, { status: 403 });
    }

    const updated = await prisma.workspace.update({
      where: { id: numericId },
      data: { name: name.trim() },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("PUT /api/workspaces error:", error);
    return NextResponse.json({ error: "Failed to update workspace" }, { status: 500 });
  }
}
