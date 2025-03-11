'use client'

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"
import { ChevronLeft, AlertCircle, CircleCheck  } from "lucide-react";
import Link from 'next/link';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"



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
          <CardTitle className="text-xl">Üdv újra itt!</CardTitle>
          <CardDescription>
          Jelentkezzen be a fiókjába a felhasználónevének megadásával
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="short_name">Felhasználónév</Label>
                  <Input
                    name="short_name"
                    type="text"
                    placeholder="naGa"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Jelszó</Label>
                    <a
                      href="#"
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      Elfelejtette jelszavát? 
                    </a>
                  </div>
                  <Input name="password" type="password" required />
                </div>
                <Button type="submit" className="w-full">
                  Bejelentkezés
                </Button>

                {error && 
                <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Sikeretlen bejelentkezés</AlertTitle>
      <AlertDescription>
        {error}
      </AlertDescription>
    </Alert>}
                {success && 
                
                <Alert variant="siker">
      <CircleCheck className="h-4 w-4" />
      <AlertTitle>Sikeres bejelentkezés</AlertTitle>
      <AlertDescription>
      Nem sokára átirányítunk a vezérlőpultra.
      </AlertDescription>
    </Alert>
                
                }
              </div>
              <div className="text-center text-sm">
              Szeretné használni a rendszerünket?{" "} 
                <a href="#" className="underline underline-offset-4">
                Lépjen velünk kapcsolatba
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
