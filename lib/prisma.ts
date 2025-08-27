// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

// Extend global type so TS knows about `globalThis.prisma`
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Use a singleton in dev to avoid exhausting database connections
export const prisma =
  global.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

// In development, store the client on the global object
if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}
