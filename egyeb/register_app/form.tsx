'use client'

import { FormEvent } from "react";


export default function Form(){

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const response = await fetch(`/api/auth/register`, {
            method: "POST",
            body: JSON.stringify({
                short_name: formData.get('short_name'),
                password: formData.get('password'),
            })
        })
        console.log({ response })
    }

    return (
        <form onSubmit={handleSubmit}>
        <input name="short_name" className="border border-black text-black" type="text"/>
        <input name="password" className="border border-black text-black" type="password"/>
        <button type="submit">
            Register
        </button>
    </form>
    )
}