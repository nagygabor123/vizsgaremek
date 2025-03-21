'use client';


import {useSession } from "next-auth/react";
import { AppSidebar } from "@/components/app-sidebar"
import { ChevronRight, ChevronLeft, Slash } from "lucide-react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarTrigger,
  SidebarInset,

  SidebarProvider,
 
} from "@/components/ui/sidebar"

import Link from "next/link";


import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import React, { useState, useEffect, useMemo } from 'react';
import {
  format,
  startOfWeek,
  addDays,
  subDays,
  addWeeks,
  getDay,
  isToday,
  isAfter,
  isBefore,
} from 'date-fns';
import { hu } from 'date-fns/locale';
import '../../../globals.css';

import AppKonfig from '@/components/app-konfig';



import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface TimetableEntry {
  day: string;
  subject: string;
  start: string;
  end: string;
  class: string;
  group: string;
  teacher: string;
}

interface Student {
  student_id: string;
  full_name: string;
  class: string;
  rfid_tag: string;
  access: string;
  status: string;
}

interface Timetable {
  student_id: string;
  first_class_start: string;
  last_class_end: string;
}

interface BreakDatesAlap {
  name: string;
  start: string;
  end: string;
}

interface plusDatesAlap {
  name: string;
  date: string;
  replaceDay: string;
}

interface lessonTimes {
  start: string;
  end: string;
}

const getWeekStartAndEnd = (date: Date) => {
  const startOfWeek2 = new Date(date);
  startOfWeek2.setDate(date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1)); // Hétfővel kezdjük a hetet
  const endOfWeek = new Date(startOfWeek2);
  endOfWeek.setDate(startOfWeek2.getDate() + 6);

  return { startOfWeek2, endOfWeek };
};

const Calendar: React.FC = () => {

  const { data: session } = useSession();

  const [systemClose, setSystemClose] = useState<boolean>(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isMobileView, setIsMobileView] = useState(false);
  //const [schedule, setSchedule] = useState<TimetableEntry[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [modalInfo, setModalInfo] = useState<{ lesson: string; time: string; className: string } | null>(null);
  const [studentTimetable, setStudentTimetable] = useState<Timetable[]>([]);
  const [breakdate, setBreakdate] = useState<BreakDatesAlap[]>([]);
  const [plusdate, setPlusdate] = useState<plusDatesAlap[]>([]);
  const [tanevkezdes, setStartYear] = useState<string | null>(null);
  const [tanevvege, setEndYear] = useState<string | null>(null);
  const [lessonTimes, setLessonTimes] = useState<lessonTimes[]>([]);





  const [hasStudents, setHasStudents] = useState<boolean | null>(null);


  const [loading, setLoading] = useState(true); // Betöltési állapot


  const [tanevkezdesDate, setTanevkezdesDate] = useState<Date | null>(null);
  const [tanevvegeDate, setTanevvegeDate] = useState<Date | null>(null);




  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);


  useEffect(() => {
    const updateView = () => {
      setIsMobileView(window.innerWidth <= 920);
    };

    updateView();
    window.addEventListener('resize', updateView);
    return () => window.removeEventListener('resize', updateView);
  }, []);

  useEffect(() => {
    const fetchLessonTimes = async () => {
      try {
        const response = await fetch('https://vizsgaremek-mocha.vercel.app/api/config/getRinging');
        if (!response.ok) {
          throw new Error('Nem sikerült lekérni a csengetési rendet.');
        }
        const data = await response.json();
        setLessonTimes(data);
      } catch (error) {
        console.error('Hiba a csengetési rend lekérésekor:', error);
      }
    };

    fetchLessonTimes();
  }, []);


  useEffect(() => {
    const fetchTimetables = async () => {
      try {
        // Fetch all students' timetable data at once from the new API endpoint
        const response = await fetch('https://vizsgaremek-mocha.vercel.app/api/timetable/allScheduleStart');
        if (!response.ok) {
          throw new Error('Nem sikerült lekérni az összes diák órarendjét.');
        }

        const data = await response.json();
        // Map the response to match the structure of your state
        const timetables = data.students.map((student: any) => ({
          student_id: student.student_id,
          first_class_start: student.first_class_start,
          last_class_end: student.last_class_end,
        }));

        setStudentTimetable(timetables);
      } catch (error) {
        console.error('Hiba történt az órarendek lekérésekor:', error);
      }
    };

    if (students.length > 0) {
      fetchTimetables();
    }
  }, [students]);

//https://vizsgaremek-mocha.vercel.app/api/timetable/getClassTimetable?className=13.I
//https://vizsgaremek-mocha.vercel.app/api/timetable/getTeacherTimetable?teacherName=${teacher}

//PaZo


  useEffect(() => {
    async function fetchSchedule() {
      try {
        const response = await fetch(`https://vizsgaremek-mocha.vercel.app/api/timetable/getClassTimetable?className=${session?.user?.osztalyfonok}
`);
        const data = await response.json();
        const formattedData = data.map((lesson: any) => ({
          day: lesson.day_of_week,
          start: lesson.start_time.slice(0, 5), // "07:15:00" -> "07:15"
          end: lesson.end_time.slice(0, 5),
          subject: lesson.group_name,
          teacher: lesson.teacher_name,
          class: lesson.class
        }));
        setSchedule(formattedData);
      } catch (error) {
        console.error('Error fetching schedule:', error);
      }
    }

    fetchSchedule();
  }, []);




  const [employees, setEmployees] = useState<any[]>([]);
  //const [selectedClass, setSelectedClass] = useState<string>('');
 // const [selectedTeacher, setSelectedTeacher] = useState<string>('');

  const [selectedValue, setSelectedValue] = useState<string>('');

  const [schedule, setSchedule] = useState<any[]>([]);

  // Dolgozók (tanárok és osztályfőnökök) lekérése
  const fetchEmployees = async () => {
    try {
      const response = await fetch('https://vizsgaremek-mocha.vercel.app/api/config/getEmployees');
      const data = await response.json();
      if (response.ok) {
        setEmployees(data);
      } else {
        console.error('Error fetching employees');
      }
    } catch (error) {
      console.error('Error connecting to the server');
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);



/*

  const classOptions = useMemo(() => {
    return Array.from(new Set(employees.map((employee) => employee.osztalyfonok)));
  }, [employees]);

  const teacherOptions = useMemo(() => {
    return Array.from(new Set(employees.map((employee) => employee.short_name)));
  }, [employees]);




  useEffect(() => {
    if (selectedValue) {
      if (classOptions.includes(selectedValue)) {
       
        fetchClassTimetable(selectedValue);
      } else if (teacherOptions.includes(selectedValue)) {
       
        fetchTeacherTimetable(selectedValue);
      }
    }
  }, [selectedValue]);*/

  // Osztály órarendjének lekérése



/*
  const fetchTeacherTimetable = async (teacherName: string) => {
    try {
      const response = await fetch(`https://vizsgaremek-mocha.vercel.app/api/timetable/getTeacherTimetable?teacherName=${teacherName}`);
      const data = await response.json();
      const formattedData = data.map((lesson: any) => ({
        day: lesson.day_of_week,
        start: lesson.start_time.slice(0, 5),
        end: lesson.end_time.slice(0, 5),
        subject: lesson.group_name,
        teacher: lesson.teacher_name,
        class: lesson.class
      }));
      setSchedule(formattedData);
    } catch (error) {
      console.error('Error fetching teacher timetable:', error);
    }
  };
*/










  useEffect(() => {
    const fetchAdditionalData = async () => {
      try {
        const plusResponse = await fetch('https://vizsgaremek-mocha.vercel.app/api/config/getYearSchedule?type=plusznap');
        const plusData = await plusResponse.json();
        setPlusdate(plusData.plusDates_alap);

        const breakResponse = await fetch('https://vizsgaremek-mocha.vercel.app/api/config/getYearSchedule?type=szunet');
        const breakData = await breakResponse.json();
        setBreakdate(breakData.breakDates_alap);

        const startResponse = await fetch('https://vizsgaremek-mocha.vercel.app/api/config/getYearSchedule?type=kezd');
        const startData = await startResponse.json();
        setStartYear(startData.schoolYearStart.start);

        const endResponse = await fetch('https://vizsgaremek-mocha.vercel.app/api/config/getYearSchedule?type=veg');
        const endData = await endResponse.json();
        setEndYear(endData.schoolYearEnd.end);
      } catch (error) {
        console.error('Error fetching additional data:', error);
      }

    };

    fetchAdditionalData();
  }, []);

  console.log('Schedule:', schedule);
  console.log('Student:', students);
  console.log('System:', systemClose);
  console.log('Break:', breakdate);
  console.log('Plusdate:', plusdate);
  console.log('Tanévkezdes:', tanevkezdes);
  console.log('Tanevvege:', tanevvege);




  useEffect(() => {
    if (tanevkezdes && tanevvege) {
      const kezdes = new Date(tanevkezdes);
      const vege = new Date(tanevvege);

      kezdes.setHours(0, 0, 0, 0);
      vege.setHours(23, 59, 59, 999);

      setTanevkezdesDate(kezdes);
      setTanevvegeDate(vege);
      setLoading(false); // Ha az adatok beálltak, kikapcsoljuk a betöltést
    }
  }, [tanevkezdes, tanevvege]); // Figyeljük a változásukat



  const getDayName = (date: Date): string => {
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return dayNames[getDay(date)];
  };
  // const isBreakDay = (date: Date) => {
  //   if (!breakdate || breakdate.length === 0) return false;

  //   const targetDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  //   return breakdate.some(({ start, end }) => {
  //     const startDate = new Date(start);
  //     const endDate = new Date(end);
  //     return targetDate >= startDate && targetDate <= endDate;
  //   });
  // };

  // const parseDate = (dateString: string) => {
  //   const [year, month, day] = dateString.split("-").map(Number);
  //   return new Date(year, month - 1, day); // hónapokat 0-indexelten tárolja a JS
  // };

  // const isBreakDay = (date: Date) => {
  //   if (!breakdate || breakdate.length === 0) return false;

  //   const targetDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  //   return breakdate.some(({ start, end }) => {
  //     const startDate = parseDate(start);
  //     const endDate = parseDate(end);

  //     return targetDate >= startDate && targetDate <= endDate;
  //   });
  // };

  const parseDate = (dateString: string) => {
    return new Date(dateString); // ISO 8601 formátumot automatikusan kezeli
  };
  
  const isBreakDay = (date: Date) => {
    if (!breakdate || breakdate.length === 0) return false;
  
    const targetDate = new Date(date.getFullYear(), date.getMonth(), date.getDate()); // Idő rész nélkül
  
    return breakdate.some(({ start, end }) => {
      const startDate = parseDate(start);
      const endDate = parseDate(end);
  
      // Dátumok összehasonlítása idő rész nélkül
      const startDateOnly = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
      const endDateOnly = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
  
      return targetDate >= startDateOnly && targetDate <= endDateOnly;
    });
  };


  // const fetchStudentTimetable = async (student_id: string) => {
  //   const response = await fetch(`http://localhost:3000/api/timetable/scheduleStart?student=${student_id}`);
  //   const data = await response.json();
  //   return data;
  // };

  // const getReplacedDayName = (date: Date): string => {
  //   const formattedDate = format(date, 'yyyy-MM-dd');
  //   // const replacement = plusdate.find((entry) => entry.date === formattedDate);
  //   const replacement = (plusdate || []).find((entry) => entry.date === formattedDate);

  //   return replacement ? replacement.replaceDay : getDayName(date);
  // };

  const getReplacedDayName = (date: Date): string => {
    const formattedDate = format(date, 'yyyy-MM-dd'); // Például: "2024-12-21"
  
    // Az ISO dátumot (pl. "2024-12-21T00:00:00.000Z") alakítsuk át "YYYY-MM-DD" formátumra
    const replacement = (plusdate || []).find((entry) => {
      const entryDateFormatted = format(new Date(entry.date), 'yyyy-MM-dd'); // ISO dátum átalakítása
      return entryDateFormatted === formattedDate;
    });
  
    return replacement ? replacement.replaceDay : getDayName(date);
  };

  const goToPrevious = () => {
    setCurrentDate((prevDate) => (isMobileView ? subDays(prevDate, 1) : addWeeks(prevDate, -1)));
  };

  const goToNext = () => {
    setCurrentDate((prevDate) => (isMobileView ? addDays(prevDate, 1) : addWeeks(prevDate, 1)));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const isCurrentLesson = (lesson: { start: string; end: string }) => {
    const now = new Date();
    const [startHour, startMinute] = lesson.start.split(':').map(Number);
    const [endHour, endMinute] = lesson.end.split(':').map(Number);

    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), startHour, startMinute);
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), endHour, endMinute);

    return isToday(currentDate) && isAfter(now, start) && isBefore(now, end);
  };

  const openModal = (lesson: string, time: string, className: string) => {
    setModalInfo({ lesson, time, className });
  };

  // const closeModal = () => {
  //   setModalInfo(null);
  // };

  const getStudentsByClass = (className: string) => {
    return students.filter((student) => {
      const studentClasses = student.class.split(',').map((item) => item.trim());
      const classNames = className.split(',').map((item) => item.trim());

      console.log("Student classes:", studentClasses);
      console.log("Search classes:", classNames);

      return studentClasses.some((cls) => classNames.includes(cls));
    });
  };



  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const daysOfWeek = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const replacedDayName = getReplacedDayName(currentDate);
  const dailyLessons = schedule.filter((lesson) => lesson.day === replacedDayName);


  const handleStudentOpen = async (student_id: string) => {
    try {
      const scheduleResponse = await fetch(`http://localhost:3000/api/timetable/scheduleStart?student=${student_id}`);

      if (!scheduleResponse.ok) {
        console.error('Nem sikerült lekérni a diák órarendjét.');
        return;
      }

      const schedule = await scheduleResponse.json();
      const { first_class_start, last_class_end } = schedule;

      // Az aktuális idő HH:MM formátumban
      const currentTime = new Date().toTimeString().slice(0, 5);

      // Ellenőrizzük, hogy az aktuális idő az órarendi időintervallumba esik-e
      if (currentTime >= first_class_start && currentTime <= last_class_end) {
        const response = await fetch(`http://localhost:3000/api/system/studentAccess?student=${student_id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
          console.error('Hiba történt a zárolás feloldásakor:', await response.text());
        }
      } else {
        console.warn('A diák jelenleg nincs órán, nem lehet feloldani.');
      }
    } catch (error) {
      console.error('Hiba történt a kérés során:', error);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await fetch('/api/students/read');
      const data = await response.json();
      setStudents(data);
      setHasStudents(data.length > 0); // Ha van legalább egy diák, akkor true
    } catch (error) {
      console.error('Error fetching students', error);
    } //finally {
    //   setLoading(false); // Lekérés vége
    // }
  };



  useEffect(() => {
    fetchStudents();
  }, []);


  const fetchSystemStatus = async () => {
    const response = await fetch('http://localhost:3000/api/system/status');
    if (response.ok) {
      const data = await response.json();
      setSystemClose(data.status === "nyitva" ? false : true);

    }
  };


  const [isButtonVisible, setButtonVisible] = useState<boolean | null>(null);

  useEffect(() => {
    const hasClickedBefore = localStorage.getItem("hasClickedOverlayButton");
    setButtonVisible(hasClickedBefore !== "true");
  }, []);

  if (isButtonVisible === null) {
    return null;
  }

  const { startOfWeek2, endOfWeek } = getWeekStartAndEnd(currentDate);


  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex flex-1 items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/dashboard">Kezdőlap</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  <Slash />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbPage>Osztályom</BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  <Slash />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbPage>Órarend</BreadcrumbPage>
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
      {/* Ide kerülhet más tartalom, ha szükséges */}
    </>
  )}
</div>
        {/* <div>
          {loading ? (
   <div className="flex items-center justify-center min-h-screen">
   <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-100 border-t-blue-600"></div>
  </div>
          ) : (
            <>
              {!hasStudents && <AppKonfig />}
            
            </>
          )}
        </div> */}

        <div className="calendar-container">
          {/* <span>{tanevkezdes}</span>
  <span>{tanevvege}</span> */}
          <div className="calendar-header">
          <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
      <span>
        {format(startOfWeek2, 'yyyy MMMM dd', { locale: hu })}. - {format(endOfWeek, 'yyyy MMMM dd', { locale: hu })}.
      </span>
    </h2>
            <div className="calendar-controls">




              {/*<Select>
                <SelectTrigger>
                  <SelectValue placeholder="Válasszon..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Osztályok</SelectLabel>
                    <SelectItem value="13i">13.I</SelectItem>
                    <SelectLabel>Tanárok</SelectLabel>
                    <SelectItem value="kisPista">Kis Pista</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>*/}
 {/*<Select value={selectedValue} onValueChange={setSelectedValue}>
          <SelectTrigger>
            <SelectValue placeholder="Válasszon..." />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Osztályok</SelectLabel>
              {classOptions.map((className, index) => (
                <SelectItem key={index} value={className}>
                  {className}
                </SelectItem>
              ))}
              <SelectLabel>Tanárok</SelectLabel>
              {teacherOptions.map((teacherName, index) => (
                <SelectItem key={index} value={teacherName}>
                  {teacherName}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>*/}



              <Button onClick={goToToday} variant="outline">Mai nap</Button>
              <Button variant="ghost" onClick={goToPrevious}><ChevronLeft /></Button>
              <Button variant="ghost" onClick={goToNext}><ChevronRight /></Button>
            </div>
          </div>

          <div className="calendar-grid">
  {isMobileView ? (
    <div>
      <div className="calendar-day">
        {format(currentDate, "eeee d", { locale: hu })}
      </div>
      {isBreakDay(currentDate) ||
      dailyLessons.length === 0 ||
      (tanevkezdesDate &&
        tanevvegeDate &&
        (currentDate < tanevkezdesDate || currentDate > tanevvegeDate)) ? (
        <div className="flex items-center justify-center h-dvh text-base text-gray-500 col-span-full">
          Nincsenek tanórák ezen a napon
        </div>
      ) : (
        lessonTimes.map((time, lessonIndex) => {
          const lessonsAtSameTime = dailyLessons.filter(
            (lesson) => lesson.start === time.start && lesson.end === time.end
          );

          if (lessonsAtSameTime.length === 0) return null;

          return (
            <div key={lessonIndex} className="calendar-cell">
              {lessonsAtSameTime.map((lesson, index) => {
                const isCurrent = isCurrentLesson(lesson);
                return (
                  <Dialog key={`${index}`}>
                    <DialogTrigger asChild>
                      {isToday(currentDate) && isCurrentLesson(lesson) ? (
                        <div
                          className={`lesson-card ${isCurrent ? 'current-lesson' : ''}`}
                          onClick={() => {
                            openModal(lesson.subject, `${lesson.start} - ${lesson.end}`, lesson.class);
                            fetchStudents();
                            fetchSystemStatus();
                          }}
                        >
                          <div className="flex justify-between items-center w-full text-xs pb-4">
                            <div className="">{lessonIndex + 1}</div>
                            <div className="">{lesson.teacher}</div>
                          </div>
                          <div className="lesson-name">{lesson.subject}</div>
                          <div className="lesson-class">{lesson.class}</div>
                        </div>
                      ) : (
                        <div className="lesson-card disabled-lesson">
                          <div className="flex justify-between items-center w-full text-xs pb-4">
                            <div className="">{lessonIndex + 1}</div>
                            <div className="">{lesson.teacher}</div>
                          </div>
                          <div className="lesson-name">{lesson.subject}</div>
                          <div className="lesson-class">{lesson.class}</div>
                        </div>
                      )}
                    </DialogTrigger>

                    {isToday(currentDate) && isCurrentLesson(lesson) && (
                      <DialogContent className="sm:max-w-[800px]">
                        <DialogHeader>
                          <DialogTitle>{modalInfo?.lesson}</DialogTitle>
                          <DialogDescription>Időpont: {modalInfo?.time} {modalInfo?.className}</DialogDescription>
                          <h3>Osztály: {modalInfo?.className}</h3>
                          <div>
                            <h4>Diákok:</h4>
                            <table className="table-auto w-full border-collapse border border-gray-300">
                              <thead>
                                <tr className="bg-gray-200">
                                  <th className="border border-gray-300 px-4 py-2">Név</th>
                                  <th className="border border-gray-300 px-4 py-2">Állapot</th>
                                  <th className="border border-gray-300 px-4 py-2">Művelet</th>
                                </tr>
                              </thead>
                              <tbody>
                                {getStudentsByClass(modalInfo?.className || '').map((student) => {
                                  const studentTimetableData = studentTimetable.find(t => t.student_id === student.student_id);
                                  const currentTime = new Date().toTimeString().slice(0, 5);
                                  const canUnlockStudent = systemClose || studentTimetableData &&
                                    currentTime >= studentTimetableData.first_class_start &&
                                    currentTime <= studentTimetableData.last_class_end;
                                  return (
                                    <tr key={student.student_id} className="border border-gray-300">
                                      <td className="border border-gray-300 px-4 py-2">{student.full_name}</td>
                                      <td className="border border-gray-300 px-4 py-2">{student.status}</td>
                                      <td className="border border-gray-300 px-4 py-2">
                                        <Button onClick={() => handleStudentOpen(student.student_id)} disabled={!canUnlockStudent}>
                                          Feloldás
                                        </Button>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </DialogHeader>
                      </DialogContent>
                    )}
                  </Dialog>
                );
              })}
            </div>
          );
        })
      )}
    </div>
  ) : (
    <>
      <div className="calendar-day"></div>
      {daysOfWeek.map((day, index) => (
        <div className={`calendar-day ${isToday(day) ? "current-day" : ""}`} key={index}>
          {format(day, "EEE d", { locale: hu })}
        </div>
      ))}

      {lessonTimes.map((time, lessonIndex) => (
        <React.Fragment key={lessonIndex}>
          <div className="lesson-time">
            <span className="time-start">{time.start}</span>
            <span className="time-end">{time.end}</span>
          </div>

          {daysOfWeek.map((day, dayIndex) => {
            if (
              tanevkezdesDate &&
              tanevvegeDate &&
              (day < tanevkezdesDate || day > tanevvegeDate)
            ) {
              return (
                <div key={`${lessonIndex}-${dayIndex}`} className="calendar-cell empty" />
              );
            }

            const dayName = getReplacedDayName(day);
            const dailyLessons = schedule.filter((lesson) => lesson.day === dayName);
            const lessonsAtSameTime = dailyLessons.filter(
              (l) => l.start === time.start && l.end === time.end
            );

            if (lessonsAtSameTime.length === 0 || isBreakDay(day)) {
              return <div key={`${lessonIndex}-${dayIndex}`} className="calendar-cell empty" />;
            }

            return (
              <div key={`${lessonIndex}-${dayIndex}`} className="calendar-cell">
                {lessonsAtSameTime.map((lesson, index) => {
                  const isCurrent = isToday(day) && isCurrentLesson(lesson);
                  return (
                    <Dialog key={`${lessonIndex}-${dayIndex}-${index}`}>
                      <DialogTrigger asChild>
                        {isToday(day) && isCurrentLesson(lesson) ? (
                          <div
                            className={`lesson-card ${isCurrent ? 'current-lesson' : ''}`}
                            onClick={() => {
                              openModal(lesson.subject, `${lesson.start} - ${lesson.end}`, lesson.class);
                              fetchStudents();
                              fetchSystemStatus();
                            }}
                          >
                            <div className="flex justify-between items-center w-full text-xs pb-4">
                              <div className="">{lessonIndex + 1}</div>
                              <div className="">{lesson.teacher}</div>
                            </div>
                            <div className="lesson-name">{lesson.subject}</div>
                            <div className="lesson-class">{lesson.class}</div>
                          </div>
                        ) : (
                          <div className="lesson-card disabled-lesson">
                            <div className="flex justify-between items-center w-full text-xs pb-4">
                              <div className="">{lessonIndex + 1}</div>
                              <div className="">{lesson.teacher}</div>
                            </div>
                            <div className="lesson-name">{lesson.subject}</div>
                            <div className="lesson-class">{lesson.class}</div>
                          </div>
                        )}
                      </DialogTrigger>
                      {isToday(day) && isCurrentLesson(lesson) && (
                        <DialogContent className="sm:max-w-[800px]">
                          <DialogHeader>
                            <DialogTitle className="text-3xl">{modalInfo?.lesson}</DialogTitle>
                            <h3>{modalInfo?.time}</h3>
                            <h3>{modalInfo?.className}</h3>
                            <div className="rounded-md border mt-5">
                              <table className="w-full">
                                <thead className="text-center text-sm text-neutral-500">
                                  <tr>
                                    <th className="p-2 font-normal">Név</th>
                                    <th className="p-2 font-normal">Állapot</th>
                                    <th className="p-2 font-normal">Művelet</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {getStudentsByClass(modalInfo?.className || '').map((student) => {
                                    const studentTimetableData = studentTimetable.find(t => t.student_id === student.student_id);
                                    const currentTime = new Date().toTimeString().slice(0, 5);
                                    const canUnlockStudent = systemClose || studentTimetableData &&
                                      currentTime >= studentTimetableData.first_class_start &&
                                      currentTime <= studentTimetableData.last_class_end;
                                    return (
                                      <tr key={student.student_id} className="text-center text-sm border-t">
                                        <td className="p-1">{student.full_name}</td>
                                        <td className="p-1">{student.status}</td>
                                        <td className="p-1">
                                          <Button onClick={() => handleStudentOpen(student.student_id)} disabled={!canUnlockStudent}>
                                            Feloldás
                                          </Button>
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </DialogHeader>
                        </DialogContent>
                      )}
                    </Dialog>
                  );
                })}
              </div>
            );
          })}
        </React.Fragment>
      ))}

      {/* Ellenőrizzük, hogy van-e bármilyen óra a héten */}
      {daysOfWeek.every(day => {
        const dayName = getReplacedDayName(day);
        const dailyLessons = schedule.filter((lesson) => lesson.day === dayName);
        return dailyLessons.length === 0 || isBreakDay(day);
      }) && (
        <div className="flex items-center justify-center h-dvh text-base text-gray-500 col-span-full">
          Nincsenek tanórák ezen a héten
        </div>
      )}
    </>
  )}
</div>

        </div>

      </SidebarInset>
    </SidebarProvider>
  );
};

export default Calendar;
