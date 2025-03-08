import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import { neon } from "@neondatabase/serverless";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      credentials: {
        short_name: { label: "Short Name", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        "use server";
        const sql = neon(`${process.env.DATABASE_URL}`);
        const response = await sql`
          SELECT * FROM admins WHERE short_name=${credentials?.short_name}`;
        const user = response[0];

        if (!user) {
          throw new Error("Felhasználó nem található");
        }

        const passwordCorrect = await compare(credentials?.password || "", user.password);

        if (!passwordCorrect) {
          throw new Error("Hibás jelszó");
        }

        return {
          id: user.id.toString(),
          short_name: user.short_name,
          full_name: user.full_name,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = String(user.id);
        token.short_name = String(user.short_name);
        token.full_name = String(user.full_name);
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.id);
        session.user.short_name = String(token.short_name);
        session.user.full_name = String(token.full_name);
      }
      return session;
    },
  },
  
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
