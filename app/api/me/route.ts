import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import {prisma} from "../../../lib/prisma";

export async function GET(req: Request) {
  try {
    const token = await getToken({ req: req as any, secret: process.env.NEXTAUTH_SECRET });
    // token might be undefined if not signed in
    const rawId = (token as any)?.id ?? (token as any)?.sub ?? null;

    const url = new URL(req.url);
    const devUserId = url.searchParams.get("userId") ?? (req.headers as any)?.get?.("x-user-id");

    if (!rawId && !devUserId && process.env.NODE_ENV !== "development") {
      return NextResponse.json({ user: null, token: null }, { status: 200 });
    }

    const userId = rawId ? (typeof rawId === "string" && /^\d+$/.test(rawId) ? Number(rawId) : rawId) : devUserId ? Number(devUserId) : null;

    if (!userId) {
      return NextResponse.json({ user: null, token }, { status: 200 });
    }

    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
      select: { id: true, email: true, name: true, createdAt: true },
    });

    return NextResponse.json({ user, token }, { status: 200 });
  } catch (err) {
    console.error("GET /api/me error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
