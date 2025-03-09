'use client'
import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react";

export default function Logout(){

    return(
        <Button variant="secondary" onClick={() => {
            signOut();
        }}>
        Kijelentkezés
      </Button>
     
    )
}