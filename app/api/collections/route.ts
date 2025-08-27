import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { NextResponse } from "next/server";

// GET collections for a specific workspace
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const workspaceId = searchParams.get("workspaceId");

    if (!workspaceId) {
      return new Response(JSON.stringify({ error: "workspaceId is required" }), { status: 400 });
    }

    const collections = await prisma.collection.findMany({
      where: { workspaceId: Number(workspaceId) }
    });

    return new Response(JSON.stringify(collections), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to fetch collections" }), { status: 500 });
  }
}

// POST create new collection
export async function POST(req: Request) {
  try {
    const { name, workspaceId } = await req.json();

    if (!name || !workspaceId) {
      return new Response(JSON.stringify({ error: "Name and workspaceId are required" }), { status: 400 });
    }

    const collection = await prisma.collection.create({
      data: {
        name,
        workspaceId: Number(workspaceId)
      }
    });

    return new Response(JSON.stringify(collection), { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to create collection" }), { status: 500 });
  }
}

// PUT update collection by id (expects ?id=123)
export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const { name } = await req.json();

    if (!id || !name) {
      return new Response(JSON.stringify({ error: "id and name are required" }), { status: 400 });
    }

    const updated = await prisma.collection.update({
      where: { id: Number(id) },
      data: { name }
    });

    return new Response(JSON.stringify(updated), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to update collection" }), { status: 500 });
  }
}

// DELETE collection by id (expects ?id=123)
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Collection id is required" }, { status: 400 });
    }

    const numericId = Number(id);
    if (Number.isNaN(numericId)) {
      return NextResponse.json({ error: "Invalid collection id" }, { status: 400 });
    }

    // Optional: check if collection exists
    const col = await prisma.collection.findUnique({ where: { id: numericId }});
    if (!col) {
      return NextResponse.json({ error: "Collection not found" }, { status: 404 });
    }

    // 1) delete child snippets first (avoids FK constraint errors)
    await prisma.snippet.deleteMany({
      where: { collectionId: numericId },
    });

    // 2) delete the collection
    await prisma.collection.delete({
      where: { id: numericId },
    });

    return NextResponse.json({ message: "Collection deleted successfully" });
  } catch (err: any) {
    // Log full error to server console (inspect terminal)
    console.error("DELETE /api/collections error:", err);
    // Return informative message to client for debugging (do not leak secrets in prod)
    return NextResponse.json({ error: err?.message ?? "Failed to delete collection" }, { status: 500 });
  } finally {
    // optional: you can disconnect prisma here in long-running scripts; for dev it's fine to leave it
    // await prisma.$disconnect();
  }
}