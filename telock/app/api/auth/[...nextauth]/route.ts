//import NextAuth from "next-auth/next";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcrypt";
import { neon } from '@neondatabase/serverless';

const handler = NextAuth({
    session: {
        strategy: "jwt"
    },
    pages: {
        signIn: "/login", 
    },
    providers: [CredentialsProvider({
        credentials: {
            short_name: {},
            password: {}
        },
        async authorize(credentials, req) {
            'use server';
            const sql = neon(`${process.env.DATABASE_URL}`);
            const response = await sql`SELECT * FROM admins WHERE short_name=${credentials?.short_name}`;
            const user = response[0];

            if (!user) return null;

            const passwordCorrect = await compare(
                credentials?.password || "",
                user.password
            );

            if (passwordCorrect) {
                return {
                    id: user.id,
                    short_name: user.short_name,
                };
            }

            return null;
        }
    })],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.short_name = user.short_name as string; // Típuskonverzió
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.short_name = token.short_name as string; // Típuskonverzió
            }
            return session;
        }
    }
});

export { handler as GET, handler as POST };