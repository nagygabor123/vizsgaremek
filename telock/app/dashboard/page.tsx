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
import { Megaphone, Phone, Users, Clock, AlertCircle, HardDrive, Download, HelpCircle, BookOpen, Mail, Video } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
// import { Progress } from "@/components/ui/progress"

export default function Page() {
  const { data: session } = useSession();

  const [students, setStudents] = useState([]);
  const [hasStudents, setHasStudents] = useState(false);
  const [studentsInStatusBe, setStudentsInStatusBe] = useState(0);
  const [loading, setLoading] = useState(true);
  const [lastBackup, setLastBackup] = useState("2025.04.03 14:30");
  const [softwareVersion, setSoftwareVersion] = useState("v2.1.4");
  const [updateAvailable, setUpdateAvailable] = useState(false);

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

  const backupStatusColor = () => {
    // Logic to determine backup status
    return "bg-green-500"; // Default to green for demo
  };

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
            {/* Welcome Banner */}
            <div className="rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 p-4 flex items-center">
              <Megaphone className="text-blue-600 h-5 w-5" />
              <p className="text-sm ml-3 text-blue-600">
                Üdvözöljük, <span className="font-medium">{session?.user?.full_name}</span>!
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Összes tanuló
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{students.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Az iskolában regisztrált tanulók száma
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Tárolt telefonok
                  </CardTitle>
                  <Phone className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{studentsInStatusBe}</div>
                  <p className="text-xs text-muted-foreground">
                    Jelenleg tárolt eszközök
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Visszavételre vár
                  </CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">5</div>
                  <p className="text-xs text-muted-foreground">
                    Közelgő határidős eszközök
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* System Information Section */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {/* Backup Status */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Utolsó mentés
                  </CardTitle>
                  <HardDrive className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-medium">{lastBackup}</div>
                    <div className={`h-2 w-2 rounded-full ${backupStatusColor()}`}></div>
                  </div>
                  <div className="mt-4">
                    <Button variant="outline" size="sm" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Kényszerített mentés
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Software Version */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Szoftver verzió
                  </CardTitle>
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-medium">{softwareVersion}</div>
                  {updateAvailable ? (
                    <Button variant="default" size="sm" className="w-full mt-4">
                      Frissítés telepítése
                    </Button>
                  ) : (
                    <p className="text-xs text-muted-foreground mt-4">
                      Legfrissebb verzió van telepítve
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Help Section */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Segítség
                  </CardTitle>
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button variant="ghost" className="w-full justify-start">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Gyors útmutató
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <HelpCircle className="h-4 w-4 mr-2" />
                      Gyakori kérdések
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <Mail className="h-4 w-4 mr-2" />
                      Kapcsolatfelvétel
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <Video className="h-4 w-4 mr-2" />
                      Oktatóvideók
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Legutóbbi aktivitás</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-blue-500 mr-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Kovács János</p>
                      <p className="text-sm text-muted-foreground">Telefon leadva - 2025.04.03 14:25</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Nagy Anna</p>
                      <p className="text-sm text-muted-foreground">Telefon visszaadva - 2025.04.03 13:40</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}