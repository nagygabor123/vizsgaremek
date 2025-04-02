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
  const [hasStudents, setHasStudents] = useState(false);
  const [studentsInStatusBe, setStudentsInStatusBe] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [yearSchedule, setYearSchedule] = useState<any>({
    plusDates: [],
    breakDates: [],
    noSchool: [],
    schoolStart: '',
    schoolEnd: ''
  });
  const [schoolStartEdit, setSchoolStartEdit] = useState('');
  const [schoolEndEdit, setSchoolEndEdit] = useState('');

  const API_BASE_URL = window.location.origin;
  
  const fetchYearSchedule = async () => {
    try {
      const [plusRes, szunetRes, noschoolRes, startRes, endRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/config/getYearSchedule?school_id=${session?.user?.school_id}&type=plusznap`),
        fetch(`${API_BASE_URL}/api/config/getYearSchedule?school_id=${session?.user?.school_id}&type=szunet`),
        fetch(`${API_BASE_URL}/api/config/getYearSchedule?school_id=${session?.user?.school_id}&type=tanitasnelkul`),
        fetch(`${API_BASE_URL}/api/config/getYearSchedule?school_id=${session?.user?.school_id}&type=kezd`),
        fetch(`${API_BASE_URL}/api/config/getYearSchedule?school_id=${session?.user?.school_id}&type=veg`)
      ]);
  
      const [plusDates, breakDates, noSchool, schoolStart, schoolEnd] = await Promise.all([
        plusRes.json(),
        szunetRes.json(),
        noschoolRes.json(),
        startRes.json(),
        endRes.json()
      ]);
  
      // Create a comprehensive list of all special dates with proper metadata
      const allEvents = [
        // School year boundaries
        {
          date: schoolStart.schoolYearStart.start,
          name: "Tanév kezdete",
          type: "year_boundary",
          isSchoolDay: true
        },
        {
          date: schoolEnd.schoolYearEnd.end,
          name: "Tanév vége",
          type: "year_boundary",
          isSchoolDay: false
        },
        
        // Breaks (school is closed)
        ...breakDates.breakDates_alap.map((item: any) => ({
          date: item.date,
          name: item.name || "Iskolai szünet",
          type: "break",
          isSchoolDay: false
        })),
        
        // Plus days (extra school days)
        ...plusDates.plusDates_alap.map((item: any) => ({
          date: item.date,
          name: item.name || "Szombati tanítási nap",
          type: "plus_day",
          isSchoolDay: true
        })),
        
        // Non-teaching workdays
        ...noSchool.tanitasnelkul_alap.map((item: any) => ({
          date: item.date,
          name: item.name || "Tanítás nélküli munkanap",
          type: "non_teaching",
          isSchoolDay: false
        }))
      ];
  
      // Filter future dates and sort chronologically
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Normalize to start of day
      
      const futureEvents = allEvents
        .filter(event => {
          const eventDate = new Date(event.date);
          eventDate.setHours(0, 0, 0, 0);
          return eventDate >= today;
        })
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
      // Get the next 2 unique dates (group same-day events)
      const uniqueDates = futureEvents.reduce((acc, event) => {
        const dateStr = event.date.split('T')[0];
        if (!acc[dateStr]) {
          acc[dateStr] = {
            date: event.date,
            events: [],
            isSchoolDay: event.isSchoolDay
          };
        }
        acc[dateStr].events.push(event);
        return acc;
      }, {});
  
      const nextUniqueDates = Object.values(uniqueDates)
        .slice(0, 2);
  
      setYearSchedule({
        plusDates: plusDates.plusDates_alap,
        breakDates: breakDates.breakDates_alap,
        noSchool: noSchool.tanitasnelkul_alap,
        schoolStart: schoolStart.schoolYearStart.start,
        schoolEnd: schoolEnd.schoolYearEnd.end,
        nextDates: nextUniqueDates,
      });
  
      setSchoolStartEdit(schoolStart.schoolYearStart.start);
      setSchoolEndEdit(schoolEnd.schoolYearEnd.end);
    } catch (error) {
      console.error('Error fetching year schedule:', error);
    } finally {
      setLoading(false);
    }
  };
  
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
      fetchYearSchedule();
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

        {yearSchedule.nextDates && yearSchedule.nextDates.length > 0 && (
  <div className="space-y-4">
    {yearSchedule.nextDates.map((day: any, index: number) => {
      const eventDate = new Date(day.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const eventDay = new Date(day.date);
      eventDay.setHours(0, 0, 0, 0);
      
      const diffInTime = eventDay.getTime() - today.getTime();
      const diffInDays = Math.ceil(diffInTime / (1000 * 3600 * 24));

      const dateString = eventDate.toLocaleDateString("hu-HU", {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      return (
        <div key={index} className={`p-4 rounded-lg shadow ${
          day.isSchoolDay ? 'bg-blue-50 border-l-4 border-blue-500' : 'bg-gray-50 border-l-4 border-gray-400'
        }`}>
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-gray-900">
                {dateString}
              </h3>
              <div className="mt-2 space-y-1">
                {day.events.map((event: any, i: number) => (
                  <div key={i} className="flex items-center text-sm">
                    {event.type === 'break'}
                    {event.type === 'plus_day'}
                    {event.type === 'non_teaching' }
                    {event.type === 'year_boundary' }
                    {event.name}
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white px-3 py-1 rounded-full text-sm font-medium">
              {diffInDays <= 0 ? 'Ma' : `${diffInDays} nap múlva`}
            </div>
          </div>
        </div>
      );
    })}
  </div>
)}


{students.length}
{studentsInStatusBe}

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
