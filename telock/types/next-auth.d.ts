import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    short_name: string;
    full_name: string;
  }

  interface Session {
    user: User;
  }

  interface JWT {
    id: string;
    short_name: string;
    full_name: string;
  }
}
