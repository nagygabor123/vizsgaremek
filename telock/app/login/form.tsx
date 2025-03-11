'use client'

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"
import { GalleryVerticalEnd, ChevronLeft } from "lucide-react";
import Link from 'next/link';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { cn } from "@/lib/utils"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

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
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Login with your Apple or Google account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="short_name">Email</Label>
                  <Input
                    name="short_name"
                    type="text"
                    placeholder="naGa"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <a
                      href="#"
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </a>
                  </div>
                  <Input name="password" type="password" required />
                </div>
                <Button type="submit" className="w-full">
                  Login
                </Button>

                {error && <p className="text-red-500 text-center">{error}</p>}
                {success && <p className="text-green-500 text-center">Sikeres bejelentkezés!</p>}
              </div>
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <a href="#" className="underline underline-offset-4">
                  Sign up
                </a>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
