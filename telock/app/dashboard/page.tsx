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

import { format } from "date-fns"
import { hu } from "date-fns/locale";


import { Megaphone } from "lucide-react";

export default function Page() {

  const days = [
    { label: 'Hétfő', value: 'monday' },
    { label: 'Kedd', value: 'tuesday' },
    { label: 'Szerda', value: 'wednesday' },
    { label: 'Csütörtök', value: 'thursday' },
    { label: 'Péntek', value: 'friday' },
  ];

  const { data: session } = useSession();

  const [students, setStudents] = useState([]);
  const [hasStudents, setHasStudents] = useState(false);
  const [studentsInStatusBe, setStudentsInStatusBe] = useState(0);
  const [loading, setLoading] = useState(true);

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
  
  
  const [nearestEvent, setNearestEvent] = useState<ScheduleItem | null>(null);
  const API_BASE_URL = window.location.origin;
  const [message, setMessage] = useState<string>('');
  const [yearSchedule, setYearSchedule] = useState<YearSchedule>({
    plusDates: [],
    breakDates: [],
    noSchool: [],
    schoolStart: '',
    schoolEnd: ''
  });
  const [schoolStartEdit, setSchoolStartEdit] = useState('');
  const [schoolEndEdit, setSchoolEndEdit] = useState('');
  const [newBreak, setNewBreak] = useState({ nev: '', which_day: '', replace_day: '', school_id: session?.user?.school_id });
  const [newNo, setNewNo] = useState({ nev: '', which_day: '', replace_day: '', school_id: session?.user?.school_id });
  const [newPlusDate, setNewPlusDate] = useState({ nev: '', which_day: '', replace_day: '', school_id: session?.user?.school_id });
  const [selectedDate, setSelectedDate] = useState<string | null>(null);


  const fetchYearSchedule = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/config/getYearSchedule?school_id=${session?.user?.school_id}`);
      const allEvents = await response.json();

      if (!Array.isArray(allEvents)) {
        throw new Error("Invalid data format");
      }

      const schoolEvents = allEvents.filter(event => 
        event.school_id === Number(session?.user?.school_id)
      );

      setYearSchedule({
        plusDates: schoolEvents.filter(e => e.type === 'plusznap'),
        breakDates: schoolEvents.filter(e => e.type === 'szunet'),
        noSchool: schoolEvents.filter(e => e.type === 'tanitasnelkul'),
        schoolStart: schoolEvents.find(e => e.type === 'kezd')?.which_day || '',
        schoolEnd: schoolEvents.find(e => e.type === 'veg')?.which_day || ''
      });
    } catch (error) {
      console.error('Error:', error);
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


        {yearSchedule.plusDates.map((plusDate: any) => (
  <tr key={plusDate.year_schedule_id} className="text-center border-t">
    <td className="p-1">{new Date(plusDate.which_day).toLocaleDateString("hu-HU")}</td>
    <td className="p-1">{days.find((day) => day.value === plusDate.replace_day)?.label || plusDate.replace_day}</td>
    <td className="p-1">
      {/* Törlés gomb */}
    </td>
  </tr>
))}

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
