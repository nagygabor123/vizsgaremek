// next-auth.d.ts
import "next-auth";

declare module "next-auth" {
  interface User {
    short_name?: string;
    full_name?: string; // full_name hozzáadása
    position?: string;
  }

  interface Session {
    user?: User;
  }
}