'use client';


import { AppSidebar } from "@/components/app-sidebar"
import {
   ChevronDown,

} from "lucide-react"


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
  Sidebar,
  SidebarTrigger,
  SidebarInset,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarProvider,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroupLabel,
  useSidebar,

} from "@/components/ui/sidebar"


import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import Link from "next/link";



import React, { useState, useEffect } from 'react';
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
import '../../globals.css';

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


const Calendar: React.FC = () => {
  const [systemClose, setSystemClose] = useState<boolean>(false); 
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isMobileView, setIsMobileView] = useState(false);
  const [schedule, setSchedule] = useState<TimetableEntry[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [modalInfo, setModalInfo] = useState<{ lesson: string; time: string; className: string } | null>(null);
  const [studentTimetable, setStudentTimetable] = useState<Timetable[]>([]);
  const [breakdate, setBreakdate] = useState<BreakDatesAlap[]>([]);
  const [plusdate, setPlusdate] = useState<plusDatesAlap[]>([]);
  const [tanevkezdes, setStartYear] = useState<string | null>(null);
  const [tanevvege, setEndYear] = useState<string | null>(null);
  const [lessonTimes, setLessonTimes] = useState<lessonTimes[]>([]);

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
        const response = await fetch('http://localhost:3000/api/config/getRinging');
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
      const timetables = await Promise.all(
        students.map(async (student) => {
          const timetable = await fetchStudentTimetable(student.student_id);
          return {
            student_id: student.student_id,
            first_class_start: timetable.first_class_start,
            last_class_end: timetable.last_class_end,
          };
        })
      );
      setStudentTimetable(timetables);
    };

    if (students.length > 0) {
      fetchTimetables();
    }
  }, [students]);


  useEffect(() => {
    async function fetchSchedule() {
      try {
        const response = await fetch('http://localhost:3000/api/timetable/admin'); 
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
  

  useEffect(() => {
    const fetchAdditionalData = async () => {
      try {
        const plusResponse = await fetch('http://localhost:3000/api/config/getYearSchedule?type=plusznap');
        const plusData = await plusResponse.json();
        setPlusdate(plusData.plusDates_alap);

        const breakResponse = await fetch('http://localhost:3000/api/config/getYearSchedule?type=szunet');
        const breakData = await breakResponse.json();
        setBreakdate(breakData.breakDates_alap);

        const startResponse = await fetch('http://localhost:3000/api/config/getYearSchedule?type=kezd');
        const startData = await startResponse.json();
        setStartYear(startData.schoolYearStart.start); 

        const endResponse = await fetch('http://localhost:3000/api/config/getYearSchedule?type=veg');
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
  console.log('System:',systemClose);
  console.log('Break:', breakdate);
  console.log('Plusdate:',plusdate);
  console.log('Tanévkezdes:', tanevkezdes);
  console.log('Tanevvege:',tanevvege);

  const getDayName = (date: Date): string => {
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return dayNames[getDay(date)];
  };
  
  const isBreakDay = (date: Date) => {
    const targetDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    return breakdate.some(({ start, end }) => {
      const startDate = new Date(start);
      const endDate = new Date(end);
      return targetDate >= startDate && targetDate <= endDate;
    });
  };
  
  const fetchStudentTimetable = async (student_id: string) => {
    const response = await fetch(`http://localhost:3000/api/timetable/scheduleStart?student=${student_id}`);
    const data = await response.json();
    return data;
  };
  
  const getReplacedDayName = (date: Date): string => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    const replacement = plusdate.find((entry) => entry.date === formattedDate);
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

  const closeModal = () => {
    setModalInfo(null);
  };

  const getStudentsByClass = (className: string) => {
    return students.filter((student) => student.class === className);
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
    const response = await fetch('/api/students/read');
    const data = await response.json();
    setStudents(data);
  };

  const fetchSystemStatus = async () => {
    const response = await fetch('http://localhost:3000/api/system/status');
    if (response.ok) {
      const data = await response.json();
      setSystemClose(data.status === "nyitva" ? false : true);
      
    }
  };

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
      <Link href="/dashboard">Főoldal</Link>
    </BreadcrumbLink>
    </BreadcrumbItem>
  <BreadcrumbSeparator />
  <BreadcrumbItem>
    <BreadcrumbPage>Tanóráim</BreadcrumbPage>
  </BreadcrumbItem>
</BreadcrumbList>
</Breadcrumb>
        </div>
        <div className="ml-auto px-3">
          {/* <NavActions /> */}
          


   

        </div>
      </header>
    <div className="calendar-container">
      <div className="calendar-header">
        <div className="calendar-date">
          <span>{format(currentDate, 'yyyy MMMM', { locale: hu })}</span>
        </div>
        <div className="calendar-controls">
          <Button onClick={goToPrevious}>{isMobileView ? 'Előző nap' : 'Előző hét'}</Button>
          <Button onClick={goToToday}>Mai nap</Button>
          <Button onClick={goToNext}>{isMobileView ? 'Következő nap' : 'Következő hét'}</Button>
        </div>
      </div>

      <div className="calendar-grid">
      {isMobileView ? (
  <div>
    <div className="calendar-day">
      {format(currentDate, 'eeee d', { locale: hu })}
    </div>
    {isBreakDay(currentDate) ? (
      <div className="no-lessons">Ma nincs tanítás!</div>
    ) : dailyLessons.length === 0 ? (
      <div className="no-lessons">Ma nincs tanítás!</div>
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
                        <div className="lesson-index">{lessonIndex + 1}</div>
                        <div className="lesson-name">{lesson.subject}</div>
                        <div className="lesson-class">{lesson.class}</div>
                      </div>
                    ) : (
                      <div
                        className="lesson-card disabled-lesson" 
                      >
                        <div className="lesson-index">{lessonIndex + 1}</div>
                        <div className="lesson-name">{lesson.subject}</div>
                        <div className="lesson-class">{lesson.class}</div>
                      </div>
                    )}
                  </DialogTrigger>

                  {isToday(currentDate) && isCurrentLesson(lesson) && ( 
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{modalInfo?.lesson}</DialogTitle>
                        <DialogDescription>Időpont: {modalInfo?.time}</DialogDescription>
                        <h3>Osztály: {modalInfo?.className}</h3>
                        <div>
                          <h4>Diákok:</h4>
                          {getStudentsByClass(modalInfo?.className || '').map((student) => {
                          const studentTimetableData = studentTimetable.find(t => t.student_id === student.student_id);
                          const currentTime = new Date().toTimeString().slice(0, 5);
                          const canUnlockStudent = systemClose || studentTimetableData &&
                            currentTime >= studentTimetableData.first_class_start &&
                            currentTime <= studentTimetableData.last_class_end;
                            return (
                              <div key={student.student_id} className="student-info">
                                <p>{student.full_name} ({student.status})</p>
                                <Button onClick={() => handleStudentOpen(student.student_id)} disabled={!canUnlockStudent}>Feloldás</Button>
                              </div>
                            );
                          })}
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
              <div className={`calendar-day ${isToday(day) ? 'current-day' : ''}`} key={index}>
                {format(day, 'EEE d', { locale: hu })}
              </div>
            ))}

{lessonTimes.map((time, lessonIndex) => (
  <React.Fragment key={lessonIndex}>
    <div className="lesson-time">
      <span className="time-start">{time.start}</span>
      <span className="time-end">{time.end}</span>
    </div>
    {daysOfWeek.map((day, dayIndex) => {
      const dayName = getReplacedDayName(day);
      const dailyLessons = schedule.filter((lesson) => lesson.day === dayName);
      const lessonsAtSameTime = dailyLessons.filter(
        (l) => l.start === time.start && l.end === time.end,
      );

      const isBreak = isBreakDay(day);
      if (lessonsAtSameTime.length === 0 || isBreak) {
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
        <div className="lesson-index">{lessonIndex + 1}</div>
        <div className="lesson-name">{lesson.subject}</div>
        <div className="lesson-class">{lesson.class}</div>
      </div>
    ) : (
      <div
        className="lesson-card disabled-lesson" 
      >
        <div className="lesson-index">{lessonIndex + 1}</div>
        <div className="lesson-name">{lesson.subject}</div>
        <div className="lesson-class">{lesson.class}</div>
      </div>
    )}
  </DialogTrigger>
  {isToday(day) && isCurrentLesson(lesson) && ( 
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{modalInfo?.lesson}</DialogTitle>
        <DialogDescription>Időpont: {modalInfo?.time}</DialogDescription>
        <h3>Osztály: {modalInfo?.className}</h3>
        <div>
          <h4>Diákok:</h4>
          {getStudentsByClass(modalInfo?.className || '').map((student) => {
          const studentTimetableData = studentTimetable.find(t => t.student_id === student.student_id);
          const currentTime = new Date().toTimeString().slice(0, 5);
          const canUnlockStudent = systemClose || studentTimetableData &&
            currentTime >= studentTimetableData.first_class_start &&
            currentTime <= studentTimetableData.last_class_end;
            return (
              <div key={student.student_id} className="student-info">
                <p>{student.full_name} ({student.status})</p>
                <Button onClick={() => handleStudentOpen(student.student_id)} disabled={!canUnlockStudent}>Feloldás</Button>
              </div>
            );
          })}
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

          </>
        )}
      </div>
    </div>
    </SidebarInset>
    </SidebarProvider>
  );
};

export default Calendar;
