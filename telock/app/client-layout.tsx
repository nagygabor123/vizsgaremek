'use client'

import { useState, useEffect } from "react";
import { Session } from "next-auth";

export default function ClientLayout({
  children,
  session
}: {
  children: React.ReactNode;
  session: Session | null;
}) {
  const [loading, setLoading] = useState(true);
  const [schoolName, setSchoolName] = useState("");

  const fetchSchool = async () => {
    try {
      const response = await fetch(`/api/system/getSchool?school_id=${session?.user?.school_id}`);
      const data = await response.json();
  
      if (data.school_name) {
        setSchoolName(data.school_name);
      } else {
        console.error("Iskola neve nem található");
      }
    } catch (error) {
      console.error("Error fetching school", error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchSchool();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-100 border-t-blue-600"></div>
      </div>
    );
  }

  return <>{children}</>;
}