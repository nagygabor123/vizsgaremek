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

import { Megaphone } from "lucide-react";

export default function Page() {
  const { data: session } = useSession();

  const [students, setStudents] = useState([]);

  const [studentsInStatusBe, setStudentsInStatusBe] = useState(0);

  const [yearSchedule, setYearSchedule] = useState<any>({
    plusDates: [],
    breakDates: [],
    noSchool: [],
    schoolStart: '',
    schoolEnd: ''
  });
  const [schoolStartEdit, setSchoolStartEdit] = useState('');
  const [schoolEndEdit, setSchoolEndEdit] = useState('');

  const [loading, setLoading] = useState(true);

  const API_BASE_URL = window.location.origin;

  const fetchYearSchedule = async () => {
    try {
      const plusRes = await fetch(`${API_BASE_URL}/api/config/getYearSchedule?school_id=${session?.user?.school_id}&type=plusznap`);
      const szunetRes = await fetch(`${API_BASE_URL}/api/config/getYearSchedule?school_id=${session?.user?.school_id}&type=szunet`);
      const noschoolRes = await fetch(`${API_BASE_URL}/api/config/getYearSchedule?school_id=${session?.user?.school_id}&type=tanitasnelkul`);
      const startRes = await fetch(`${API_BASE_URL}/api/config/getYearSchedule?school_id=${session?.user?.school_id}&type=kezd`);
      const endRes = await fetch(`${API_BASE_URL}/api/config/getYearSchedule?school_id=${session?.user?.school_id}&type=veg`);
  
      const plusDates = await plusRes.json();
      const breakDates = await szunetRes.json();
      const noSchool = await noschoolRes.json();
      const schoolStart = await startRes.json();
      const schoolEnd = await endRes.json();
  
      const allDates = [
        ...plusDates.plusDates_alap.map((item: any) => ({ date: item.which_day, name: item.type })),
        ...breakDates.breakDates_alap.map((item: any) => ({ date: item.which_day, name: item.type })),
        ...noSchool.tanitasnelkul_alap.map((item: any) => ({ date: item.which_day, name: item.type })),
        { date: schoolStart.schoolYearStart.start, name: "kezd" },
        { date: schoolEnd.schoolYearEnd.end, name: "veg" }
      ];
  
      // Szűrés: Csak a jövőbeli dátumokat tartjuk meg
      const futureDates = allDates
        .filter((item) => new Date(item.date) >= new Date())
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); // Rendezés dátum szerint növekvő sorrendben
  
      // Az első két legközelebbi dátumot kiválasztjuk
      const nextDates = futureDates.slice(0, 2);
  
      setYearSchedule({
        plusDates: plusDates.plusDates_alap,
        breakDates: breakDates.breakDates_alap,
        noSchool: noSchool.tanitasnelkul_alap,
        schoolStart: schoolStart.schoolYearStart.start,
        schoolEnd: schoolEnd.schoolYearEnd.end,
        nextDates: nextDates,  // Az első két legközelebbi dátum tárolása
      });
  
      setSchoolStartEdit(schoolStart.schoolYearStart.start);
      setSchoolEndEdit(schoolEnd.schoolYearEnd.end);
    } catch (error) {
      console.error('Error fetching year schedule:', error);
    } finally {
      setLoading(false);
    }
  };
  
  
  
  useEffect(() => {
    fetchYearSchedule();
  }, []);
  
  const fetchStudents = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/students/read?school_id=${session?.user?.school_id}`
      );
      const data = await response.json();
      setStudents(data);

      // Számoljuk meg, hány tanuló van "be" státusszal
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

        <div>
        {loading ? (
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-100 border-t-blue-600"></div>
          </div>
        ) : (
          <>


        <div className="flex flex-col gap-4 p-4 overflow-x-hidden w-full">
          <div className="grid auto-rows-min gap-4 w-full">
            <div className="min-h-[60px] rounded-xl bg-blue-50 flex items-center px-4 w-full box-border overflow-hidden">
              <Megaphone className="text-blue-600" />
              <p className="text-sm truncate ml-3 text-blue-600">
                Üdvözöljük, {session?.user?.full_name}!
              </p>
            </div>
          </div>
        </div>

{students.length}
{studentsInStatusBe}

{yearSchedule.nextDates && yearSchedule.nextDates.length > 0 && (
  <div>
    {yearSchedule.nextDates.map((event: any, index: number) => {
      const eventDate = new Date(event.date);
      const today = new Date();
      const diffInTime = eventDate.getTime() - today.getTime();
      const diffInDays = Math.ceil(diffInTime / (1000 * 3600 * 24));

      return (
        <div key={index} className="p-4 bg-white rounded-lg mt-4 shadow-lg">
          <p>Esemény típusa: {event.name}</p>
          <p>Dátum: {eventDate.toLocaleDateString("hu-HU")}</p>
          <p>{diffInDays} nap múlva lesz.</p>
        </div>
      );
    })}
  </div>
)}




        </>
        )}
      </div>
        {/* <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="aspect-video rounded-xl bg-blue-50" />
            <div className="aspect-video rounded-xl bg-blue-50" />
            <div className="aspect-video rounded-xl bg-blue-50" />
          </div>
          <div className="min-h-[100vh] flex-1 rounded-xl bg-blue-50 md:min-h-min" />
        </div> */}
       
      </div>
  )
}
