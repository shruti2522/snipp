// app/api/workspaces/[id]/route.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);

  try {
    // 1. Find collections of this workspace
    const collections = await prisma.collection.findMany({
      where: { workspaceId: id },
      select: { id: true },
    });

    const collectionIds = collections.map((c) => c.id);

    // 2. Delete all snippets in these collections
    if (collectionIds.length > 0) {
      await prisma.snippet.deleteMany({
        where: { collectionId: { in: collectionIds } },
      });
    }

    // 3. Delete all collections
    await prisma.collection.deleteMany({
      where: { workspaceId: id },
    });

    // 4. Delete workspace
    await prisma.workspace.delete({
      where: { id },
    });

    return new Response(
      JSON.stringify({ message: "Workspace and all related data deleted successfully" }),
      { status: 200 }
    );
  } catch (err: any) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: "Failed to delete workspace" }),
      { status: 400 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);

  try {
    const { name } = await req.json();

    if (!name || !name.trim()) {
      return new Response(JSON.stringify({ error: "Name is required" }), { status: 400 });
    }

    const updatedWorkspace = await prisma.workspace.update({
      where: { id },
      data: { name: name.trim() },
    });

    return new Response(JSON.stringify(updatedWorkspace), { status: 200 });
  } catch (err: any) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Workspace not found" }), { status: 404 });
  }
}
