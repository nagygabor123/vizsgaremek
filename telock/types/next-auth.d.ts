// types/next-auth.d.ts
import NextAuth from "next-auth";

// Definiáljuk, hogy a User típus tartalmazza a 'short_name' mezőt
declare module "next-auth" {
  interface User {
    short_name: string;
  }
  interface Session {
    user: User;
  }
}
