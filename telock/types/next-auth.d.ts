// types/next-auth.d.ts
import "next-auth";

declare module "next-auth" {
    interface User {
        short_name?: string;
    }

    interface Session {
        user?: User;
    }
}