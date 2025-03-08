'use client'

import { FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Form(){
    const router = useRouter()
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const response = await signIn('credentials', {
            short_name: formData.get('short_name'),
            password: formData.get('password'),
            redirect: false,
        });

        console.log({response})
        if(!response?.error){
            router.push("/dashboard");
            router.refresh();
        }
    }

    return (
        <form onSubmit={handleSubmit}>
        <input name="short_name" className="border border-black text-black" type="text"/>
        <input name="password" className="border border-black text-black" type="password"/>
        <button type="submit">
            Login
        </button>
    </form>
    )
}