// middleware.ts
export { default } from "next-auth/middleware";

// Protect only dashboard routes
export const config = {
  matcher: ["/dashboard/:path*"],
};
