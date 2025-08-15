import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const snippets = await prisma.snippet.findMany({
      include: { tags: true, workspace: true },
    });
    return NextResponse.json(snippets);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch snippets" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const snippet = await prisma.snippet.create({
      data: {
        title: body.title,
        description: body.description,
        code: body.code,
        language: body.language,
        workspaceId: body.workspaceId,
        tags: {
          connectOrCreate: body.tags.map((tag: string) => ({
            where: { name: tag },
            create: { name: tag },
          })),
        },
      },
    });
    return NextResponse.json(snippet);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create snippet" }, { status: 500 });
  }
}
