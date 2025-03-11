'use client'

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"
import { GalleryVerticalEnd, ChevronLeft } from "lucide-react";
import Link from 'next/link';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function Form() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const response = await signIn('credentials', {
      short_name: formData.get('short_name') as string,
      password: formData.get('password') as string,
      redirect: false,
    });

    if (response?.error) {
      setError("Hibás felhasználónév vagy jelszó!");
    } else {
      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 1500);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <Button variant="ghost" className="absolute left-4 top-4 p-2" asChild>
        <Link href="/">
          <ChevronLeft /> Vissza
        </Link>
      </Button>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <GalleryVerticalEnd className="size-6" />
            <h1 className="text-2xl font-bold">Üdv újra itt</h1>
            <p className="text-center text-base">Adja meg felhasználónevét a bejelentkezéshez</p>
          </div>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="short_name">Felhasználónév</Label>
              <Input name="short_name" type="text" placeholder="NaGa" required />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Jelszó</Label>
                <a href="#" className="ml-auto text-sm underline-offset-2 hover:underline">
                  Elfelejtette jelszavát?
                </a>
              </div>
              <Input name="password" type="password" required />
            </div>
          </div>
          <Button type="submit" className="w-full">Bejelentkezés</Button>

          {/* Hiba- vagy sikerüzenet */}
          {error && <p className="text-red-500 text-center">{error}</p>}
          {success && <p className="text-green-500 text-center">Sikeres bejelentkezés!</p>}
        </div>
      </form>
      <div className="text-center text-xs text-muted-foreground [&_a]:underline hover:[&_a]:text-primary">
        <a href="#">Szeretné használni a rendszerünket? Írjon nekünk!</a>
      </div>
    </div>
  );
}
