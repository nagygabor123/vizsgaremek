'use server';

import { neon } from "@neondatabase/serverless";
import { compare } from "bcrypt";

export async function authorize(credentials: any) {
  const sql = neon(`${process.env.DATABASE_URL}`);
  const response = await sql`
    SELECT * FROM admins WHERE short_name=${credentials?.short_name}`;
  const user = response[0];

  if (!user) {
    return null;
  }

  const passwordCorrect = await compare(
    credentials?.password || "",
    user.password
  );

  if (passwordCorrect) {
    return {
      id: user.id,
      short_name: user.short_name,
      full_name: user.full_name,
      position: user.position,
      osztalyfonok: user.osztalyfonok,
      password: user.password,
    };
  }

  return null;
}
