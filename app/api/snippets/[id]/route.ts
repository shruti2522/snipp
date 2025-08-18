import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);

    if (!id) {
      return NextResponse.json({ error: "Snippet ID is required" }, { status: 400 });
    }

    await prisma.snippet.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Snippet deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete snippet" }, { status: 500 });
  }
}
