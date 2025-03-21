import { type Session, type TokenSet, type User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { authorize } from "@/app/api/auth/authorize"; // Új import

export const authOptions = {
  session: {
    strategy: "jwt" as const,
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
        return await authorize(credentials); // Külön szerveroldali függvény meghívása
      },
    }),
  ],
  callbacks: {
    async session({ session, token }: { session: Session; token: TokenSet }) {
      if (session.user && token.short_name && token.full_name && token.position && token.osztalyfonok) {
        session.user.short_name = token.short_name as string;
        session.user.full_name = token.full_name as string;
        session.user.position = token.position as string;
        session.user.osztalyfonok = token.osztalyfonok as string;
      }
      return session;
    },
    async jwt({ token, user }: { token: TokenSet; user?: User }) {
      if (user) {
        token.short_name = user.short_name;
        token.full_name = user.full_name;
        token.position = user.position;
        token.osztalyfonok = user.osztalyfonok;
      }
      return token;
    },
  },
};