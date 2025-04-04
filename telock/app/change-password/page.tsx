"use client";

import { FormEvent, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import localFont from "next/font/local";

const ZenDots = localFont({
  src: "../fonts/ZenDots-Regular.ttf",
  variable: "--font-zen-dots",
  weight: "100 900",
});

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"
import { ChevronLeft, AlertCircle, CircleCheck } from "lucide-react";

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

export default function ChangePassword() {
  const { data: session } = useSession();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const API_BASE_URL = window.location.origin;

  const handleChangePassword = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    if (!session?.user?.password) {
      setError("Hiba: nincs bejelentkezett felhasználó.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/config/changePassword`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldPassword, newPassword })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Hiba a jelszó módosítása során");
      } else {
        setSuccess(data.message || "Jelszó sikeresen módosítva!");
        setOldPassword("");
        setNewPassword("");
        await signOut({ redirect: false });
        router.push("/login");
      }
    } catch (err) {
      setError("Hálózati hiba történt. Kérjük, próbálja újra később.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-zinc-50 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="/" className="flex items-center gap-2 self-center font-medium">
          <span className={`${ZenDots.className} text-xl`}>
            telock
          </span>
        </a>
        <div className="flex flex-col gap-6">
          <Button variant="ghost" className="absolute left-4 top-4 p-2" asChild>
            <Link href="/dashboard">
              <ChevronLeft /> Vissza
            </Link>
          </Button>
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Jelszó módosíts</CardTitle>
              <CardDescription>
                Kérjük, adja meg jelenlegi jelszavát, majd állítson be egy újat.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangePassword} method="POST">
                <div className="grid gap-6">
                  <div className="grid gap-6">
                    <div className="grid gap-2">
                      <Label htmlFor="old_password">Régi jelszó</Label>
                      <Input
                        name="old_password"
                        type="password"
                        placeholder=""
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <div className="flex items-center">
                        <Label htmlFor="new_password">Új jelszó</Label>
                      </div>
                      <Input
                        name="new_password"
                        type="password"
                        placeholder=""
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                      />
                    </div>

                    {error && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Sikeretlen jelszóváltoztatás</AlertTitle>
                        <AlertDescription className="text-red-600">
                          {error}
                        </AlertDescription>
                      </Alert>
                    )}

                    {success && (
                      <Alert variant="siker">
                        <CircleCheck className="h-4 w-4" />
                        <AlertTitle>Sikeres jelszóváltoztatás</AlertTitle>
                        <AlertDescription>
                          {success}
                        </AlertDescription>
                      </Alert>
                    )}

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? "Feldolgozás..." : "Jelszó módosítása"}
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
          <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
            Kérjük, ne ossza meg új jelszavát senkivel. A biztonsága érdekében csak Ön ismerheti.
          </div>
        </div>
      </div>
    </div>
  );
}