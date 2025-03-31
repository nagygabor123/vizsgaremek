'use client'

import { getServerSession } from "next-auth";
import type { Metadata } from "next";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";
import Providers from "./providers";
import "./globals.css";
import { useState, useEffect } from "react";

import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';

export const metadata: Metadata = {
  title: "telock: Biztonságos és kényelmes telefontárolos iskoláknak",
  description: "telock: Biztonságos és kényelmes telefontárolos iskoláknak",
};



export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {


  
  const session = await getServerSession(authOptions);
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

  return ( 
    <div>
    {loading ? (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-100 border-t-blue-600"></div>
      </div>
    ) : (
      <>
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`} >
      <body>
        <Providers session={session}>
          <div>
            {children}
          </div>
        </Providers>
      </body>
    </html>
        </>
      )}
    </div>
  );
}