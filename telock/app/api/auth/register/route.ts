import { NextResponse } from "next/server";
import {hash} from 'bcrypt';
import { neon } from '@neondatabase/serverless';


export async function POST(request: Request) {
   try {
    'use server';

    const {short_name, password} = await request.json();

    const full_name = "Szalkai Adam2";
    const osztalyfonok = "nincs";
    const position = "igazgatohelyettes";



    console.log({short_name, password});

    const hashedPassword = await hash(password, 10);

    const sql = neon(`${process.env.DATABASE_URL}`);

    const response = await sql`
    INSERT INTO admins (full_name, password, position, osztalyfonok, short_name)
    VALUES (${full_name}, ${hashedPassword}, ${position}, ${osztalyfonok}, ${short_name})
    `;



   } catch (e) {
    console.log({ e });
   }

   return NextResponse.json({message: 'success'})
}