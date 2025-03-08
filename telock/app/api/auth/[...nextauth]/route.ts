import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
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
            const response = await sql`
            SELECT * FROM admins WHERE short_name=${credentials?.short_name}`;
            const user = response[0];
            const passwordCorrect = await compare(
                credentials?.password || "",
                user.password);

            console.log({ passwordCorrect });

            if (passwordCorrect) {
                return {
                    id: user.id,
                    short_name: user.short_name,
                    name: user.name,  // Add name to the returned object
                };
            }

            return null;
        }
    })],
    callbacks: {
        async session({ session, token }) {
            if (token?.name && session?.user) {  // Check if session and session.user are defined
                session.user.name = token.name;  // Add name to session object
            }
            return session;
        }
    }
    
});

export { handler as GET, handler as POST };
