import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { NextResponse } from "next/server";

// GET: list all workspaces or get one workspace by ?id=123
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      const workspaces = await prisma.workspace.findMany({
        orderBy: { id: "desc" }, // use createdAt if available
      });
      return NextResponse.json(workspaces, { status: 200 });
    }

    const numericId = Number(id);
    if (Number.isNaN(numericId)) {
      return NextResponse.json({ error: "Invalid workspace id" }, { status: 400 });
    }

    const workspace = await prisma.workspace.findUnique({
      where: { id: numericId },
    });

    if (!workspace) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
    }

    return NextResponse.json(workspace, { status: 200 });
  } catch (error) {
    console.error("GET /api/workspace error:", error);
    return NextResponse.json({ error: "Failed to fetch workspaces" }, { status: 500 });
  }
}

// POST: create new workspace
export async function POST(req: Request) {
  try {
    const { name } = await req.json();

    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const workspace = await prisma.workspace.create({
      data: { name: name.trim() },
    });

    return NextResponse.json(workspace, { status: 201 });
  } catch (error) {
    console.error("POST /api/workspace error:", error);
    return NextResponse.json({ error: "Failed to create workspace" }, { status: 500 });
  }
}

// PUT: update workspace by id (expects ?id=123 and body { name })
export async function PUT(req: Request) {
  try {
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

    // optional: check existence
    const existing = await prisma.workspace.findUnique({ where: { id: numericId } });
    if (!existing) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
    }

    const updated = await prisma.workspace.update({
      where: { id: numericId },
      data: { name: name.trim() },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("PUT /api/workspace error:", error);
    return NextResponse.json({ error: "Failed to update workspace" }, { status: 500 });
  }
}
