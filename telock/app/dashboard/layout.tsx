// app/dashboard/layout.tsx
'use client' // Client Component kell az állapot kezeléshez

import { useState, useEffect } from 'react'
import { AppSidebar } from "@/components/app-sidebar"
import { useSession } from "next-auth/react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session } = useSession()
  const [schoolName, setSchoolName] = useState('')

  useEffect(() => {
    const fetchSchool = async () => {
      if (!session?.user?.school_id) return
      
      try {
        const response = await fetch(`/api/system/getSchool?school_id=${session.user.school_id}`)
        const data = await response.json()
        setSchoolName(data.school_name || "")
      } catch (error) {
        console.error("Error fetching school", error)
      }
    }

    fetchSchool()
  }, [session?.user?.school_id])

  return (
    <div className="flex h-screen">
      <AppSidebar schoolName={schoolName} />
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  )
}