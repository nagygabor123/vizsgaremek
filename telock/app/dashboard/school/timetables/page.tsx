"use client"; 
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const Calendar = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Ha még tölt, ne csináljunk semmit

    if (!session) {
      router.push("/login");
    } else if (session.user?.position !== "igazgato") {
      router.push("/dashboard");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return <div>Betöltés...</div>;
  }

  return <div>Naptár oldal</div>;
};

export default Calendar;
