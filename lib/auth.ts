// lib/auth.ts
import { type NextAuthOptions } from "next-auth";
import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "./prisma"; // keep as your project currently exports it

const env = (key: string, fallback?: string) =>
  process.env[key] ?? (fallback ? process.env[fallback] : undefined);

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",   // 👈 custom login page
  },
  providers: [
    Google({
      clientId: env("GOOGLE_CLIENT_ID", "GOOGLE_ID") ?? "",
      clientSecret: env("GOOGLE_CLIENT_SECRET", "GOOGLE_SECRET") ?? "",
    }),
    GitHub({
      clientId: env("GITHUB_CLIENT_ID", "GITHUB_ID") ?? "",
      clientSecret: env("GITHUB_CLIENT_SECRET", "GITHUB_SECRET") ?? "",
    }),
    Credentials({
      name: "Email & Password",
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user || !user.password) return null;

        const isValid = await compare(credentials.password, user.password);
        if (!isValid) return null;
        return { id: user.id, email: user.email!, name: user.name ?? undefined };
      },
    }),
  ],
  callbacks: {
    // Attach DB user id and provider info to the JWT
    async jwt({ token, user, account }) {
      // when a user signs in, `user` will be available — persist DB id
      if (user) {
        (token as any).uid = (user as any).id ?? (token as any).uid ?? token.sub;
      }
      // keep provider info (useful for UI/debugging)
      if (account) {
        (token as any).provider = account.provider;
        (token as any).providerAccountId = account.providerAccountId;
      }
      return token;
    },

    // Expose id and provider info on session
    async session({ session, token }) {
      if ((token as any)?.uid && session.user) {
        (session.user as any).id = (token as any).uid;
      }
      // attach provider info to session root (not inside user) for convenience
      (session as any).provider = (token as any).provider;
      (session as any).providerAccountId = (token as any).providerAccountId;
      return session;
    },

    // Auto-link OAuth accounts to existing user by email
    async signIn({ user, account, profile }) {
      try {
        // Only handle oauth signins (skip credentials)
        if (!account || account.type !== "oauth") return true;

        const email = (profile as any)?.email ?? (user as any)?.email;
        if (!email) return true;

        // Find an existing user by email
        const existingUser = await prisma.user.findUnique({ where: { email } });

        if (existingUser) {
          // Check if there's already an account with this provider+providerAccountId
          const existingAccount = await prisma.account.findFirst({
            where: {
              provider: account.provider,
              providerAccountId: account.providerAccountId,
            },
          });

          // If no such account exists, create one linking to the existing user
          if (!existingAccount) {
            await prisma.account.create({
              data: {
                userId: existingUser.id,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                refresh_token: (account as any).refresh_token ?? null,
                access_token: (account as any).access_token ?? null,
                expires_at: (account as any).expires_at ?? null,
                token_type: (account as any).token_type ?? null,
                scope: (account as any).scope ?? null,
                id_token: (account as any).id_token ?? null,
                oauth_token: (account as any).oauth_token ?? null,
                oauth_token_secret: (account as any).oauth_token_secret ?? null,
              },
            });
          }
        }

        return true;
      } catch (err) {
        console.error("Error in signIn callback (auto-link):", err);
        // Return true to avoid blocking sign-in on non-fatal errors.
        return true;
      }
    },

    // Keep your redirect behavior
    async redirect({ url, baseUrl }) {
      try {
        if (!url) return `${baseUrl}/dashboard`;
        if (url.startsWith("/")) return `${baseUrl}${url}`;
        const to = new URL(url);
        if (to.origin === baseUrl) return url;
        return `${baseUrl}/dashboard`;
      } catch {
        return `${baseUrl}/dashboard`;
      }
    },
  },

  // ensure you have NEXTAUTH_SECRET set
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
