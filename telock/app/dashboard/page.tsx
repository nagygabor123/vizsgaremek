"use client";

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
} from "@/components/ui/sidebar"
import { Megaphone, TabletSmartphone, GraduationCap, Server, Lock, Calendar, BookOpen, HelpCircle, Mail, Video, LockOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function Page() {
  const { data: session } = useSession();

  const [students, setStudents] = useState([]);
  const [studentsInStatusBe, setStudentsInStatusBe] = useState(0);
  const [loading, setLoading] = useState(true);
  const [systemStatus, setSystemStatus] = useState<"nyithato" | "zart">("zart");


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

  const fetchSystemStatus = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/system/status?school_id=${session?.user?.school_id}`);
      if (response.ok) {
        const data = await response.json();
        setSystemStatus(data.status);
      }
    } catch (error) {
      console.error("Error fetching system status", error);
    }
    // finally {
    //   setLoading(false);
    // }
  };

  useEffect(() => {
    if (session?.user?.school_id) {
      fetchSystemStatus();
      fetchStudents();
    }
  }, [session?.user?.school_id]);

  return (
    <div className="min-h-screen">
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

      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-100 border-t-blue-600"></div>
        </div>
      ) : (
        <div className="p-6">

          <div className="flex flex-col gap-4 overflow-x-hidden w-full pb-6">
            <div className="grid auto-rows-min gap-4 w-full">
              <div className="min-h-[60px] rounded-xl bg-blue-100 flex items-center px-4 w-full box-border overflow-hidden">
                <Megaphone className="text-blue-600 hidden sm:block" />
                <p className="text-sm truncate ml-3 text-blue-600">
                  Üdvözöljük, <span className="font-medium">{session?.user?.full_name}</span>!
                </p>
              </div>

            </div>
          </div>

          <div className="space-y-6">

            <div className="grid gap-4 md:grid-cols-2">

              <Card className="">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Mai dátum
                  </CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent className="flex items-center gap-4">
                  <div>
                    <h3 className="text-xl font-bold">
                      {new Date().toLocaleDateString('hu-HU', {

                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date().toLocaleDateString('hu-HU', {
                        weekday: 'long',

                      })}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Rendszer állapota
                  </CardTitle>
                  <Server className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent className="flex items-center gap-4">
                  <div className={`rounded-full p-3 ${systemStatus === "nyithato"
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                    }`}>
                    {systemStatus === "nyithato" ? (
                      <LockOpen className="h-6 w-6" />
                    ) : (
                      <Lock className="h-6 w-6" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">
                      {systemStatus === "nyithato" ? "Feloldott" : "Korlátozott"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {systemStatus === "nyithato"
                        ? "Nyitható az összes tároló."
                        : "Órarend szerint nyithatóak a tárolók."}
                    </p>
                  </div>
                </CardContent>
              </Card>

            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Tanulók száma
                  </CardTitle>
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold">{students.length}</div>
                  <p className="text-sm text-muted-foreground">
                    Az iskola rendszerében lévő tanulók
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Tárolt eszközök
                  </CardTitle>
                  <TabletSmartphone className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold">{studentsInStatusBe}</div>
                  <p className="text-sm text-muted-foreground">
                    Jelenleg tárolt telefonok
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Segítség és támogatás</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2 sm:grid-cols-2">
                  <Button variant="outline" className="h-16 justify-start">
                    <BookOpen className="h-4 w-4 mr-2" />
                    <div className="text-left">
                      <p className="font-medium">Használati útmutató</p>
                      <p className="text-xs text-muted-foreground">PDF dokumentáció</p>
                    </div>
                  </Button>
                  <Button variant="outline" className="h-16 justify-start">
                    <HelpCircle className="h-4 w-4 mr-2" />
                    <div className="text-left">
                      <p className="font-medium">GYIK</p>
                      <p className="text-xs text-muted-foreground">Gyakori kérdések</p>
                    </div>
                  </Button>
                  <Button variant="outline" className="h-16 justify-start">
                    <Mail className="h-4 w-4 mr-2" />
                    <div className="text-left">
                      <p className="font-medium">Kapcsolat</p>
                      <p className="text-xs text-muted-foreground">Szalkai-Szabó Ádám és Nagy Gábor</p>
                    </div>
                  </Button>
                  <Button variant="outline" className="h-16 justify-start">
                    <Video className="h-4 w-4 mr-2" />
                    <div className="text-left">
                      <p className="font-medium">Oktatóvideók</p>
                      <p className="text-xs text-muted-foreground">Bemutató videók</p>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

    </div>
  )
}