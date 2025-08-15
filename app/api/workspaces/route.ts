import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET() {
  const workspaces = await prisma.workspace.findMany();
  return new Response(JSON.stringify(workspaces));
}
