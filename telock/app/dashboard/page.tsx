"use client";

import { AppSidebar } from "@/components/app-sidebar"
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarTrigger,
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Megaphone, Phone, Users, Calendar, BookOpen, HelpCircle, Mail, Video } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function Page() {
  const { data: session } = useSession();

  const [students, setStudents] = useState([]);
  const [studentsInStatusBe, setStudentsInStatusBe] = useState(0);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = window.location.origin;
  
  const fetchStudents = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/students/read?school_id=${session?.user?.school_id}`
      );
      const data = await response.json();
      setStudents(data);
      const beCount = data.filter((student: any) => student.status === "be").length;
      setStudentsInStatusBe(beCount);
    } catch (error) {
      console.error("Error fetching students", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.school_id) {
      fetchStudents();
    }
  }, [session?.user?.school_id]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white/50 backdrop-blur-md">
        <div className="flex flex-1 items-center gap-2 px-3">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Kezdőlap</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="p-6">
        {loading ? (
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-100 border-t-blue-600"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Üdvözlő üzenet */}
            <div className="rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
              <div className="flex items-center">
                <Megaphone className="text-blue-600 h-5 w-5" />
                <p className="text-sm ml-3 text-blue-600">
                  Üdvözöljük, <span className="font-medium">{session?.user?.full_name}</span>!
                </p>
              </div>
              <p className="text-sm mt-2 text-blue-600">
                Jelenleg <span className="font-bold">{studentsInStatusBe} telefon</span> van tárolva a rendszerben.
              </p>
            </div>

            {/* Gyors statisztikák */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Tanulók száma
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{students.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Az iskolában regisztrált tanulók
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Tárolt eszközök
                  </CardTitle>
                  <Phone className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{studentsInStatusBe}</div>
                  <p className="text-xs text-muted-foreground">
                    Jelenleg tárolt telefonok
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Általános információk */}
            <Card>
              <CardHeader>
                <CardTitle>Általános információk</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-start gap-4">
                    <Calendar className="h-5 w-5 mt-0.5 text-muted-foreground" />
                    <div>
                      <h4 className="font-medium">Mai dátum</h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date().toLocaleDateString('hu-HU', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <Phone className="h-5 w-5 mt-0.5 text-muted-foreground" />
                    <div>
                      <h4 className="font-medium">Telefontároló nyitva</h4>
                      <p className="text-sm text-muted-foreground">
                        7:30 - 16:00 között
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Gyors hozzáférés */}
            <Card>
              <CardHeader>
                <CardTitle>Gyors hozzáférés</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2 sm:grid-cols-2">
                  <Button variant="outline" className="h-14 justify-start gap-3">
                    <BookOpen className="h-4 w-4" />
                    <span>Útmutató</span>
                  </Button>
                  <Button variant="outline" className="h-14 justify-start gap-3">
                    <HelpCircle className="h-4 w-4" />
                    <span>GYIK</span>
                  </Button>
                  <Button variant="outline" className="h-14 justify-start gap-3">
                    <Mail className="h-4 w-4" />
                    <span>Kapcsolat</span>
                  </Button>
                  <Button variant="outline" className="h-14 justify-start gap-3">
                    <Video className="h-4 w-4" />
                    <span>Videók</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}