// app/api/auth/auth.config.ts
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcrypt';
import { neon } from '@neondatabase/serverless';

export const authOptions = {
  session: {
    strategy: 'jwt' as const, // Explicit típusmegadás
  },
  pages: {
    signIn: '/login',
  },
  providers: [
    CredentialsProvider({
      credentials: {
        short_name: {},
        password: {},
      },
      async authorize(credentials, req) {
        const sql = neon(`${process.env.DATABASE_URL}`);
        const response = await sql`
          SELECT * FROM admins WHERE short_name=${credentials?.short_name}`;
        const user = response[0];

        const passwordCorrect = await compare(
          credentials?.password || '',
          user.password
        );

        if (passwordCorrect) {
          return {
            id: user.id,
            short_name: user.short_name,
          };
        }

        return null;
      },
    }),
  ],
};