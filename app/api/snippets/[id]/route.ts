import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(
  req: Request,
  context: { params: any } // params may be a Promise in some Next versions
) {
  try {
    // Await params per Next.js guidance to support sync/async dynamic APIs
    const params = await context.params;
    const id = Number(params?.id);

    if (!id || Number.isNaN(id)) {
      return NextResponse.json({ error: "Snippet ID is required or invalid" }, { status: 400 });
    }

    await prisma.snippet.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Snippet deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/snippets/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete snippet" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  context: { params: any } // params may be a Promise in some Next versions
) {
  try {
    console.log("PATCH request received");

    // Await params per Next.js guidance
    const params = await context.params;
    console.log("Params:", params);

    const id = Number(params?.id);
    console.log("Parsed snippet ID:", id);

    if (!id || Number.isNaN(id)) {
      console.log("No valid ID provided");
      return NextResponse.json({ error: "Snippet ID is required or invalid" }, { status: 400 });
    }

    const body = await req.json();
    console.log("Request body:", body);

    const { title, description, code, language, tags } = body;

    // Build dynamic update object for partial updates
    const data: any = {};
    if (title !== undefined) data.title = title;
    // allow clearing description by explicitly providing null
    if (description !== undefined) data.description = description;
    if (code !== undefined) data.code = code;
    if (language !== undefined) data.language = language;

    console.log("Update data prepared:", data);

    // Handle tags if provided
    if (tags && Array.isArray(tags)) {
      console.log("Updating tags:", tags);
      data.tags = {
        set: [], // remove existing
        connectOrCreate: tags.map((t: string) => ({
          where: { name: t },
          create: { name: t },
        })),
      };
    }

    const updatedSnippet = await prisma.snippet.update({
      where: { id },
      data,
      include: { tags: true, collection: true },
    });

    console.log("Snippet successfully updated:", updatedSnippet);

    return NextResponse.json({ snippet: updatedSnippet });
  } catch (error) {
    console.error("Error updating snippet:", error);
    return NextResponse.json({ error: "Failed to update snippet" }, { status: 500 });
  }
}
