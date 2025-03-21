"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Calendar = () => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("/api/auth/session");
        const data = await res.json();

        if (!res.ok || !data.session) {
          router.push("/login");
          return;
        }

        if (data.session.user?.position !== "igazgato") {
          router.push("/dashboard");
          return;
        }

        setLoading(false);
      } catch (error) {
        console.error("Session fetch error:", error);
        router.push("/login");
      }
    };

    checkSession();
  }, [router]);

  if (loading) {
    return <div>Betöltés...</div>;
  }

  return <div>Naptár oldal</div>;
};

export default Calendar;
