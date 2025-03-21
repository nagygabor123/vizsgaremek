// components/AuthCheck.tsx (Szerverkomponens)
import { getServerSession } from "next-auth";
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import { redirect } from "next/navigation";

export default async function AuthCheck() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  if (session.user?.position !== "igazgato") {
    redirect("/dashboard");
  }

  return null; // Nem jelenít meg semmit, csak ellenőriz
}



