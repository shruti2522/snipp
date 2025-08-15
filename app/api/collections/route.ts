import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

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
      return new Response(JSON.stringify({ error: "id is required" }), { status: 400 });
    }

    await prisma.collection.delete({
      where: { id: Number(id) }
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to delete collection" }), { status: 500 });
  }
}
