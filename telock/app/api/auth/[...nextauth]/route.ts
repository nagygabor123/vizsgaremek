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
            const sql = neon(`${process.env.DATABASE_URL}`);
            const response = await sql`
                SELECT * FROM admins WHERE short_name=${credentials?.short_name}`;
            const user = response[0];
        
            const passwordCorrect = await compare(
                credentials?.password || "",
                user.password
            );
        
            if (passwordCorrect) {
                return {
                    id: user.id,
                    short_name: user.short_name, // Itt adjuk vissza a short_name-t
                };
            }
        
            return null;
        }
    })]
})

export { handler as GET, handler as POST };