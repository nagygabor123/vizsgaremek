import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      short_name?: string;
    };
  }

  interface User extends DefaultUser {
    short_name?: string;
  }
}
