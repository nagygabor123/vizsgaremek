"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

import { Separator } from "@/components/ui/separator";
import {
  SidebarTrigger,
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";

import { format } from "date-fns";
import { hu } from "date-fns/locale";

import { Megaphone } from "lucide-react";

interface ScheduleItem {
  year_schedule_id: number;
  type: string;
  nev: string;
  which_day: string;
  replace_day: string;
  school_id: number;
}

interface YearSchedule {
  plusDates: ScheduleItem[];
  breakDates: ScheduleItem[];
  noSchool: ScheduleItem[];
  schoolStart: string;
  schoolEnd: string;
}

export default function Page() {
  const { data: session } = useSession();

  const [students, setStudents] = useState([]);
  const [studentsInStatusBe, setStudentsInStatusBe] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const days = [
    { label: 'Hétfő', value: 'monday' },
    { label: 'Kedd', value: 'tuesday' },
    { label: 'Szerda', value: 'wednesday' },
    { label: 'Csütörtök', value: 'thursday' },
    { label: 'Péntek', value: 'friday' },
  ];

  const [yearSchedule, setYearSchedule] = useState<YearSchedule>({
    plusDates: [],
    breakDates: [],
    noSchool: [],
    schoolStart: '',
    schoolEnd: ''
  });

  const API_BASE_URL = window.location.origin;

  const fetchYearSchedule = async () => {
    try {
      if (!session?.user?.school_id) {
        throw new Error("Missing school ID");
      }

      const response = await fetch(
        `${API_BASE_URL}/api/config/getYearSchedule?school_id=${session.user.school_id}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Handle different response formats
      const events = Array.isArray(data) ? data : 
                   data.data ? data.data : 
                   [];

      const schoolEvents = events.filter((event: any) => 
        event.school_id === Number(session?.user?.school_id)
      );

      setYearSchedule({
        plusDates: schoolEvents.filter((e: any) => e.type === 'plusznap'),
        breakDates: schoolEvents.filter((e: any) => e.type === 'szunet'),
        noSchool: schoolEvents.filter((e: any) => e.type === 'tanitasnelkul'),
        schoolStart: schoolEvents.find((e: any) => e.type === 'kezd')?.which_day || '',
        schoolEnd: schoolEvents.find((e: any) => e.type === 'veg')?.which_day || ''
      });

    } catch (err) {
      console.error('Error fetching year schedule:', err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    }
  };

  const fetchStudents = async () => {
    try {
      if (!session?.user?.school_id) return;

      const response = await fetch(
        `${API_BASE_URL}/api/students/read?school_id=${session.user.school_id}`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch students: ${response.status}`);
      }

      const data = await response.json();
      setStudents(data);

      const beCount = data.filter((student: any) => student.status === "be").length;
      setStudentsInStatusBe(beCount);
      
    } catch (err) {
      console.error("Error fetching students", err);
      setError(err instanceof Error ? err.message : "Failed to load student data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.school_id) {
      fetchStudents();
      fetchYearSchedule();
    }
  }, [session?.user?.school_id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-100 border-t-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
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

      <div className="flex flex-col gap-4 p-4 overflow-x-hidden w-full">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="grid auto-rows-min gap-4 w-full">
          <div className="min-h-[60px] rounded-xl bg-blue-50 flex items-center px-4 w-full box-border overflow-hidden">
            <Megaphone className="text-blue-600" />
            <p className="text-sm truncate ml-3 text-blue-600">
              Üdvözöljük, {session?.user?.full_name}!
            </p>
          </div>
        </div>

        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">Szombati tanítási napok</h2>
          
          {yearSchedule.plusDates.length > 0 ? (
            <div className="rounded-xl border overflow-x-auto w-full">
              <table className="w-full min-w-max">
                <thead className="text-center text-sm text-muted-foreground">
                  <tr>
                    <th className="p-2">Dátum</th>
                    <th className="p-2">Órarendi nap</th>
                  </tr>
                </thead>
                <tbody>
                  {yearSchedule.plusDates.map((plusDate) => (
                    <tr key={plusDate.year_schedule_id} className="text-center border-t">
                      <td className="p-1">
                        {plusDate.which_day ? 
                          format(new Date(plusDate.which_day), 'PPP', { locale: hu }) : 
                          'Nincs dátum'}
                      </td>
                      <td className="p-1">
                        {days.find(day => day.value === plusDate.replace_day)?.label || 
                         plusDate.replace_day || 
                         'Nincs megadva'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center p-3 text-muted-foreground">
              Nincs megjeleníthető szombati tanítási nap
            </div>
          )}
        </div>

        <div className="mt-4">
          <h3 className="font-semibold">Statisztikák:</h3>
          <p>Tanulók száma: {students.length}</p>
          <p>"Be" státuszú tanulók: {studentsInStatusBe}</p>
        </div>
      </div>
    </div>
  );
}