import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { name, workspaceId } = await req.json();

  const collection = await prisma.collection.create({
    data: {
      name,
      workspaceId: Number(workspaceId)
    }
  });

  return new Response(JSON.stringify(collection), { status: 201 });
}
