import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET() {
  const workspaces = await prisma.workspace.findMany();
  return new Response(JSON.stringify(workspaces));
}

export async function POST(req: Request) {
  try {
    const { name } = await req.json();

    if (!name || !name.trim()) {
      return new Response(JSON.stringify({ error: "Name is required" }), { status: 400 });
    }

    const workspace = await prisma.workspace.create({
      data: { name: name.trim() }
    });

    return new Response(JSON.stringify(workspace), { status: 201 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to create workspace" }), { status: 500 });
  }
}
