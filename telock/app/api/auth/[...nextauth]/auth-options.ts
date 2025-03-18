// app/api/auth/[...nextauth]/auth-options.ts
import { type Session, type TokenSet, type User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import { neon } from '@neondatabase/serverless';

export const authOptions = {
  session: {
    strategy: "jwt" as const, // A strategy típusa legyen "jwt"
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      credentials: {
        short_name: {},
        password: {},
      },
      async authorize(credentials, req) {
        'use server';
        const sql = neon(`${process.env.DATABASE_URL}`);
        const response = await sql`
          SELECT * FROM admins WHERE short_name=${credentials?.short_name}`;
        const user = response[0];

        const passwordCorrect = await compare(
          credentials?.password || "",
          user.password
        );

        if (passwordCorrect) {
          return {
            id: user.id,
            short_name: user.short_name,
            full_name: user.full_name, // full_name hozzáadása
            position: user.position,
          };
        }

        return null;
      },
    }),
  ],
// app/api/auth/[...nextauth]/auth-options.ts
callbacks: {
    async session({ session, token }: { session: Session; token: TokenSet }) {
      if (session.user && token.short_name && token.full_name && token.position) {
        session.user.short_name = token.short_name as string;
        session.user.full_name = token.full_name as string; 
        session.user.position = token.position as string; 
      }
      return session;
    },
    async jwt({ token, user }: { token: TokenSet; user?: User }) {
      if (user) {
        token.short_name = user.short_name;
        token.full_name = user.full_name; // full_name hozzáadása
        token.position = user.position; 
      }
      return token;
    },
  },
};