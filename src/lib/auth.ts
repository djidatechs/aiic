import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";
import { Adapter } from "next-auth/adapters";

export const authOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  secret: process.env.NEXTAUTH_SECRET as string,
  session: {
    strategy: "jwt",
  },
  pages : {
    signIn : "/admin/auth",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) token.id = user.id;
      if (user?.name) token.name = user.name;
      if (user?.isAdmin) token.isAdmin = user.isAdmin;
      return token;
    },

    async session({ session, token }: { session: any; token: any }) {
      session.admin = {}; // Ensure session.admin is defined
      if (token?.id) session.admin.id = token.id;
      if (token?.name) session.admin.name = token.name;
      if (token?.isAdmin) session.admin.isAdmin = token.isAdmin;
      return session;
    },
  },

  providers: [
    CredentialsProvider({
      type: "credentials",
      credentials: {},
      //@ts-ignore
      async authorize(credentials, req) {
        const { email: username, password } = credentials as {
          email: string;
          password: string;
        };

        const admin = await prisma.admin.findFirst({
          where: { username: username },
        });

        if (admin && bcrypt.compareSync(password, admin.password)) {
          return {
            id: admin.id,
            name: admin.name,
            username: admin.username,
            isAdmin: admin.role === "ADMIN" || admin.role === "OWNER",
            isOwner: admin.role === "OWNER",
          };
        }
        throw new Error("Invalid Username or Password");
      },
    }),
  ],
} satisfies NextAuthOptions;
