import "next-auth";

declare module "next-auth" {
  interface User {
    short_name?: string;
    full_name?: string;
    position?: string;
    osztalyfonok?: string;
    password?: string;
    school_id?: string;
  }

  interface Session {
    user?: User;
  }
}