import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const collectionId = searchParams.get("collectionId");

    if (!collectionId) {
      return NextResponse.json([], { status: 200 }); // Return empty array if no collection selected
    }

    const snippets = await prisma.snippet.findMany({
      where: { collectionId: Number(collectionId) },
      include: { tags: true, collection: true },
    });

    return NextResponse.json(snippets);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch snippets" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.collectionId) {
      return NextResponse.json({ error: "collectionId is required" }, { status: 400 });
    }

    const snippet = await prisma.snippet.create({
      data: {
        title: body.title,
        description: body.description,
        code: body.code,
        language: body.language,
        collectionId: body.collectionId,
        tags: {
          connectOrCreate: body.tags.map((tag: string) => ({
            where: { name: tag },
            create: { name: tag },
          })),
        },
      },
      include: { tags: true, collection: true },
    });

    return NextResponse.json(snippet);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create snippet" }, { status: 500 });
  }
}
