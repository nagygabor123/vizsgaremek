'use client';

import { useSession } from "next-auth/react";
import { ChevronRight, ChevronLeft, DoorOpen, CircleMinus, CircleCheck, CircleAlert } from "lucide-react"

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
} from "@/components/ui/sidebar"

import Link from "next/link";

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
  startOfWeek2.setDate(date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1));
  const endOfWeek = new Date(startOfWeek2);
  endOfWeek.setDate(startOfWeek2.getDate() + 6);

  return { startOfWeek2, endOfWeek };
};

const Calendar: React.FC = () => {
  const { data: session } = useSession();
  const [groupStudents, setGroupStudents] = useState<string[]>([]);
  const [systemClose, setSystemClose] = useState<boolean>(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isMobileView, setIsMobileView] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [modalInfo, setModalInfo] = useState<{ lesson: string; time: string; className: string } | null>(null);
  const [studentTimetable, setStudentTimetable] = useState<Timetable[]>([]);
  const [breakdate, setBreakdate] = useState<BreakDatesAlap[]>([]);
  const [plusdate, setPlusdate] = useState<plusDatesAlap[]>([]);
  const [tanevkezdes, setStartYear] = useState<string | null>(null);
  const [tanevvege, setEndYear] = useState<string | null>(null);
  const [lessonTimes, setLessonTimes] = useState<lessonTimes[]>([]);
  const [unlockedStudents, setUnlockedStudents] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [hasStudents, setHasStudents] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [tanevkezdesDate, setTanevkezdesDate] = useState<Date | null>(null);
  const [tanevvegeDate, setTanevvegeDate] = useState<Date | null>(null);

  const API_BASE_URL = window.location.origin;

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
        const response = await fetch(`${API_BASE_URL}/api/config/getRinging?school_id=${session?.user?.school_id}`);
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

        const response = await fetch(`${API_BASE_URL}/api/timetable/allScheduleStart?school_id=${session?.user?.school_id}`);
        if (!response.ok) {
          throw new Error('Nem sikerült lekérni az összes diák órarendjét.');
        }

        const data = await response.json();

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

  useEffect(() => {
    async function fetchSchedule() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/timetable/getTeacherTimetable?teacherName=${session?.user?.short_name}
`);
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
        console.error('Error fetching schedule:', error);
      }
    }

    fetchSchedule();
  }, []);

  const [employees, setEmployees] = useState<any[]>([]);
  const [schedule, setSchedule] = useState<any[]>([]);

  const fetchEmployees = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/config/getEmployees?school_id=${session?.user?.school_id}`);
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

  useEffect(() => {
    const fetchAdditionalData = async () => {
      try {
        const plusResponse = await fetch(`${API_BASE_URL}/api/config/getYearSchedule?school_id=${session?.user?.school_id}&type=plusznap`);
        const plusData = await plusResponse.json();
        setPlusdate(plusData.plusDates_alap);

        const breakResponse = await fetch(`${API_BASE_URL}/api/config/getYearSchedule?school_id=${session?.user?.school_id}&type=szunet`);
        const breakData = await breakResponse.json();
        setBreakdate(breakData.breakDates_alap);

        const startResponse = await fetch(`${API_BASE_URL}/api/config/getYearSchedule?school_id=${session?.user?.school_id}&type=kezd`);
        const startData = await startResponse.json();
        setStartYear(startData.schoolYearStart.start);

        const endResponse = await fetch(`${API_BASE_URL}/api/config/getYearSchedule?school_id=${session?.user?.school_id}&type=veg`);
        const endData = await endResponse.json();
        setEndYear(endData.schoolYearEnd.end);
      } catch (error) {
        console.error('Error fetching additional data:', error);
      }

    };

    fetchAdditionalData();
  }, []);

  // console.log('Schedule:', schedule);
  // console.log('Student:', students);
  // console.log('System:', systemClose);
  // console.log('Break:', breakdate);
  // console.log('Plusdate:', plusdate);
  // console.log('Tanévkezdes:', tanevkezdes);
  // console.log('Tanevvege:', tanevvege);

  useEffect(() => {
    if (tanevkezdes && tanevvege) {
      const kezdes = new Date(tanevkezdes);
      const vege = new Date(tanevvege);

      kezdes.setHours(0, 0, 0, 0);
      vege.setHours(23, 59, 59, 999);

      setTanevkezdesDate(kezdes);
      setTanevvegeDate(vege);
      setLoading(false);
    }
  }, [tanevkezdes, tanevvege]);

  const getDayName = (date: Date): string => {
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return dayNames[getDay(date)];
  };

  const parseDate = (dateString: string) => {
    return new Date(dateString);
  };

  const isBreakDay = (date: Date) => {
    if (!breakdate || breakdate.length === 0) return false;

    const targetDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    return breakdate.some(({ start, end }) => {
      const startDate = parseDate(start);
      const endDate = parseDate(end);

      const startDateOnly = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
      const endDateOnly = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

      return targetDate >= startDateOnly && targetDate <= endDateOnly;
    });
  };

  const getReplacedDayName = (date: Date): string => {
    const formattedDate = format(date, 'yyyy-MM-dd');


    const replacement = (plusdate || []).find((entry) => {
      const entryDateFormatted = format(new Date(entry.date), 'yyyy-MM-dd');
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

  const getStudentsByClass = (className: string) => {
    return students.filter((student) => {
      const studentClasses = student.class.split(',').map((item) => item.trim());
      const classNames = className.split(',').map((item) => item.trim());

      //console.log("Student classes:", studentClasses);
      //console.log("Search classes:", classNames);

      return studentClasses.some((cls) => classNames.includes(cls));
    });
  };

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const daysOfWeek = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const replacedDayName = getReplacedDayName(currentDate);
  const dailyLessons = schedule.filter((lesson) => lesson.day === replacedDayName);


  const handleStudentOpen = async (student_id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/system/studentAccess?student=${student_id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        console.error('Hiba történt a zárolás feloldásakor:', await response.text());
      } else {
        const data = await response.json();
        // console.log(data.message);
        setUnlockedStudents(prev => new Set(prev).add(student_id));
      }
    } catch (error) {
      console.error('Hiba történt a kérés során:', error);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/students/read?school_id=${session?.user?.school_id}`);
      const data = await response.json();
      setStudents(data);
      setHasStudents(data.length > 0);
    } catch (error) {
      console.error('Error fetching students', error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchSystemStatus = async () => {
    const response = await fetch(`${API_BASE_URL}/api/system/status?school_id=${session?.user?.school_id}`);
    if (response.ok) {
      const data = await response.json();
      setSystemClose(data.status === "nyithato" ? false : true);
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

  const getPaginatedStudents = (className: string, page: number) => {
    const allStudents = getStudentsByClass(className);
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return allStudents.slice(startIndex, endIndex);
  };

  async function searchGroupStudent(group: string) {
    // console.log("kapott csoport:", group);
    const groupArray = group.split(',').map(g => g.trim());

    const studentsInGroup = students
      .filter(student =>
        groupArray.some(groupName => student.class.toLowerCase().includes(groupName.toLowerCase()))
      )
      .map(student => student.student_id);

    setGroupStudents(studentsInGroup);

    if (group.length === 0) {
      // console.log("Nincs megfelelő diák a keresési feltétel alapján.");
      return;
    }
    // console.log("Csoportba tartozó diákok:", studentsInGroup);

    try {
      const response = await fetch(`${API_BASE_URL}/api/system/groupAccess`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          students: studentsInGroup,
        }),
      });

      if (!response.ok) {
        throw new Error('Hiba történt a kérés küldésekor');
      }

      const responseData = await response.json();
      // console.log("Sikeres válasz a szervertől:", responseData);
    } catch (error) {
      console.error("Hiba a végpont elérésekor:", error);
    }
  }

  return (
    <div>
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
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Saját órák</BreadcrumbPage>
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
            <div className="p-6">
              <div className="calendar-container">

                <div className="calendar-header">
                  <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                    <span>
                      {format(startOfWeek2, 'yyyy MMMM dd', { locale: hu })}. - {format(endOfWeek, 'yyyy MMMM dd', { locale: hu })}.
                    </span>
                  </h2>
                  <div className="calendar-controls">

                    <Button onClick={goToToday} variant="outline">Mai nap</Button>
                    <Button variant="ghost" onClick={goToPrevious} data-testid="prev-button"><ChevronLeft /></Button>
                    <Button variant="ghost" onClick={goToNext} data-testid="next-button"><ChevronRight /></Button>
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
                                  <Dialog onOpenChange={(isOpen) => {
                                    if (!isOpen) {
                                      setCurrentPage(1);
                                    }
                                  }}
                                    key={`${index}`}>
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
                                          <DialogTitle>{modalInfo?.lesson} ({modalInfo?.time})</DialogTitle>
                                          <DialogDescription>{modalInfo?.className}</DialogDescription>

                                          <div>
                                            <div>
                                              <Button variant="outline" onClick={() => searchGroupStudent(lesson.class)} >
                                                <DoorOpen /> Nyitás engedélyezése
                                              </Button>
                                            </div>
                                            <div className="rounded-md border mt-5">
                                              <table className="w-full">
                                                <thead className="text-center text-sm text-muted-foreground">
                                                  <tr>
                                                    <th className="p-2 font-normal">Teljes név</th>
                                                    <th className="p-2 font-normal">Státusz</th>
                                                    <th className="p-2 font-normal">Művelet</th>
                                                  </tr>
                                                </thead>
                                                <tbody>
                                                  {getPaginatedStudents(modalInfo?.className || '', currentPage).map((student) => {
                                                    const studentTimetableData = studentTimetable.find(t => t.student_id === student.student_id);
                                                    const currentTime = new Date().toTimeString().slice(0, 5);
                                                    const canUnlockStudent = systemClose || studentTimetableData &&
                                                      currentTime >= studentTimetableData.first_class_start &&
                                                      currentTime <= studentTimetableData.last_class_end;
                                                    return (
                                                      <tr key={student.student_id} className="text-center text-sm border-t">
                                                        <td className="p-1">{student.full_name}</td>
                                                        <td className="p-1">
                                                          {student.status === "ki" ? <span className="text-gray-500"><CircleMinus className="w-4 h-4 inline-block" /></span> : student.status === "be" ? <span className="text-green-500"><CircleCheck className="w-4 h-4 inline-block" /></span> : <span className="text-red-500"><CircleAlert className="w-4 h-4 inline-block" /></span>}


                                                        </td>
                                                        <td className="p-1">
                                                          <Button
                                                            variant="ghost"
                                                            onClick={() => handleStudentOpen(student.student_id)}
                                                            disabled={!canUnlockStudent || unlockedStudents.has(student.student_id)}
                                                            data-testid="unlock-button"
                                                          >
                                                            <DoorOpen className="w-4 h-4 inline-block" />
                                                          </Button>
                                                        </td>
                                                      </tr>
                                                    );
                                                  })}
                                                </tbody>
                                              </table>
                                            </div>
                                            <div className="flex justify-between mt-4">
                                              <Button variant="ghost"
                                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                                disabled={currentPage === 1}
                                              >
                                                <ChevronLeft /> Előző
                                              </Button>
                                              <Button variant="ghost"
                                                onClick={() => setCurrentPage((prev) => prev + 1)}
                                                disabled={getPaginatedStudents(modalInfo?.className || '', currentPage + 1).length === 0}
                                              >
                                                Következő <ChevronRight />
                                              </Button>
                                            </div>
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
                                    <Dialog onOpenChange={(isOpen) => {
                                      if (!isOpen) {
                                        setCurrentPage(1);
                                      }
                                    }}
                                      key={`${lessonIndex}-${dayIndex}-${index}`}>
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
                                        <DialogContent className="sm:w-[800px]">
                                          <DialogHeader>
                                            <DialogTitle>{modalInfo?.lesson} ({modalInfo?.time})</DialogTitle>
                                            <DialogDescription>{modalInfo?.className}</DialogDescription>

                                            <div>
                                              <div>
                                                <Button variant="outline" onClick={() => searchGroupStudent(lesson.class)} >
                                                  <DoorOpen /> Nyitás engedélyezése
                                                </Button>
                                              </div>
                                              <div className="rounded-md border mt-5">
                                                <table className="w-full">
                                                  <thead className="text-center text-sm text-muted-foreground">
                                                    <tr>
                                                      <th className="p-2 font-normal">Teljes név</th>
                                                      <th className="p-2 font-normal">Státusz</th>
                                                      <th className="p-2 font-normal">Művelet</th>
                                                    </tr>
                                                  </thead>
                                                  <tbody>
                                                    {getPaginatedStudents(modalInfo?.className || '', currentPage).map((student) => {
                                                      const studentTimetableData = studentTimetable.find(t => t.student_id === student.student_id);
                                                      const currentTime = new Date().toTimeString().slice(0, 5);
                                                      const canUnlockStudent = systemClose || studentTimetableData &&
                                                        currentTime >= studentTimetableData.first_class_start &&
                                                        currentTime <= studentTimetableData.last_class_end;
                                                      return (
                                                        <tr key={student.student_id} className="text-center text-sm border-t">
                                                          <td className="p-1">{student.full_name}</td>
                                                          <td className="p-1">
                                                            {student.status === "ki" ? <span className="text-gray-500"><CircleMinus className="w-4 h-4 inline-block" /></span> : student.status === "be" ? <span className="text-green-500"><CircleCheck className="w-4 h-4 inline-block" /></span> : <span className="text-red-500"><CircleAlert className="w-4 h-4 inline-block" /></span>}


                                                          </td>
                                                          <td className="p-1">
                                                            <Button variant="ghost" onClick={() => handleStudentOpen(student.student_id)} disabled={!canUnlockStudent || unlockedStudents.has(student.student_id)} data-testid="unlock-button">

                                                              <DoorOpen className="w-4 h-4 inline-block" />
                                                            </Button>
                                                          </td>
                                                        </tr>
                                                      );
                                                    })}
                                                  </tbody>
                                                </table>
                                              </div>
                                              <div className="flex justify-between mt-4">
                                                <Button variant="ghost"
                                                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                                  disabled={currentPage === 1}
                                                >
                                                  <ChevronLeft /> Előző
                                                </Button>
                                                <Button variant="ghost"
                                                  onClick={() => setCurrentPage((prev) => prev + 1)}
                                                  disabled={getPaginatedStudents(modalInfo?.className || '', currentPage + 1).length === 0}
                                                >
                                                  Következő <ChevronRight />
                                                </Button>
                                              </div>
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
            </div>
          </>
        )}
      </div>

    </div>
  );
};

export default Calendar;
