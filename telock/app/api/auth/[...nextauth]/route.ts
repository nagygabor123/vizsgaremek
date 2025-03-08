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
            email: {},
            password: {}
        },
        async authorize(credentials, req) {


            'use server';
            const sql = neon(`${process.env.DATABASE_URL}`);
            const response = await sql`
            SELECT * FROM users WHERE email=${credentials?.email}`;
            const user = response[0];
            const passwordCorrect = await compare(
                credentials?.password || "",
                 user.password);

                 console.log({passwordCorrect})

            if (passwordCorrect) {
                return {
                    id: user.id,
                    email: user.email,
                }
            }


            return null;
        }
    })]
})

export { handler as GET, handler as POST };