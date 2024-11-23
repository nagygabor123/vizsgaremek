// app/page.tsx
"use client";

import React, { useState, useEffect } from "react";
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
} from "date-fns";
import { hu } from "date-fns/locale";
import "./globals.css";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const testSchedule = [
  { day: "monday", subject: "Matematika", start: "07:15", end: "08:00", class: "9.I", group: "", teacher: "Pityu" },
  { day: "monday", subject: "Történelem", start: "08:10", end: "08:55", class: "9.I", group: "", teacher: "Pityu" },
  { day: "monday", subject: "Fizika", start: "10:00", end: "10:45", class: "9.I", group: "", teacher: "Pityu" },
  { day: "monday", subject: "Biológia", start: "10:55", end: "11:40", class: "9.I", group: "", teacher: "Pityu" },
  { day: "monday", subject: "Földrajz", start: "12:55", end: "13:40", class: "9.I", group: "", teacher: "Pityu" },
  { day: "monday", subject: "Ének", start: "13:45", end: "14:30", class: "9.I", group: "", teacher: "Pityu" },
  { day: "monday", subject: "Rajz", start: "14:35", end: "15:20", class: "9.I", group: "", teacher: "Pityu" },
  { day: "tuesday", subject: "Kémia", start: "07:15", end: "08:00", class: "9.I", group: "", teacher: "Pityu" },
  { day: "tuesday", subject: "Tesi", start: "08:10", end: "08:55", class: "9.I", group: "", teacher: "Pityu" },
  { day: "friday", subject: "Tesi", start: "09:05", end: "09:50", class: "9.I", group: "", teacher: "Pityu" },
  { day: "friday", subject: "Pif", start: "09:05", end: "09:50", class: "9.I", group: "", teacher: "Matyi" },

  { day: "saturday", subject: "Kuk", start: "11:50", end: "12:35", class: "9.I", group: "", teacher: "Matyi" },

  // További órák...
];


const lessonTimes = [
  { start: "07:15", end: "08:00" },
  { start: "08:10", end: "08:55" },
  { start: "09:05", end: "09:50" },
  { start: "10:00", end: "10:45" },
  { start: "10:55", end: "11:40" },
  { start: "11:50", end: "12:35" },
  { start: "12:55", end: "13:40" },
  { start: "13:45", end: "14:30" },
  { start: "14:35", end: "15:20" },
];

const getDayName = (date: Date): string => {
  const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  return dayNames[getDay(date)];
};
const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isMobileView, setIsMobileView] = useState(false);
  const [modalInfo, setModalInfo] = useState<{ lesson: string; time: string } | null>(null);

  useEffect(() => {
    const updateView = () => {
      // setIsMobileView(window.innerWidth <= 480);
      setIsMobileView(window.innerWidth <= 920);
    };

    updateView();
    window.addEventListener("resize", updateView);
    return () => window.removeEventListener("resize", updateView);
  }, []);

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
    const [startHour, startMinute] = lesson.start.split(":").map(Number);
    const [endHour, endMinute] = lesson.end.split(":").map(Number);

    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), startHour, startMinute);
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), endHour, endMinute);

    return isToday(currentDate) && isAfter(now, start) && isBefore(now, end);
  };

  const openModal = (lesson: string, time: string) => {
    setModalInfo({ lesson, time });
  };

  const closeModal = () => {
    setModalInfo(null);
  };

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const daysOfWeek = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const currentDayName = getDayName(currentDate);

  // Szűrjük ki az adott nap óráit
  const dailyLessons = testSchedule.filter((lesson) => lesson.day === currentDayName);

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <div className="calendar-date">
          <span>{format(currentDate, "yyyy MMMM", { locale: hu })}</span>
        </div>
        <div className="calendar-controls">
          <Button onClick={goToPrevious}>{isMobileView ? "Előző nap" : "Előző hét"}</Button>
          <Button onClick={goToToday}>Mai nap</Button>
          <Button onClick={goToNext}>{isMobileView ? "Következő nap" : "Következő hét"}</Button>
        </div>
      </div>

      <div className="calendar-grid">
        {isMobileView ? (
          <div>
            <div className="calendar-day">{format(currentDate, "eeee d", { locale: hu })}</div>

            {lessonTimes.map((time, lessonIndex) => {
              const lessonsAtSameTime = dailyLessons.filter(
                (lesson) => lesson.start === time.start && lesson.end === time.end
              );

              if (lessonsAtSameTime.length === 0) return null;

              return (
                <div key={lessonIndex} className="calendar-cell">
                  {lessonsAtSameTime.map((lesson, index) => (
                    <Dialog key={index}>
                      <DialogTrigger asChild>
                        <div
                          className={`lesson-card ${
                            isToday(currentDate) && isCurrentLesson(lesson) ? "current-lesson" : ""
                          }`}
                          onClick={() => openModal(lesson.subject, `${lesson.start} - ${lesson.end}`)}
                        >
                          <div className="lesson-index">{lessonIndex + 1}</div>
                          <div className="lesson-name">{lesson.subject}</div>
                          <div className="lesson-name">{lesson.class}</div>
                        </div>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{modalInfo?.lesson}</DialogTitle>
                          <DialogDescription>Időpont: {modalInfo?.time}</DialogDescription>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
                  ))}
                </div>
              );
            })}
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
                  const dayName = getDayName(day);
                  const dailyLessons = testSchedule.filter((lesson) => lesson.day === dayName);
                  const lessonsAtSameTime = dailyLessons.filter(
                    (l) => l.start === time.start && l.end === time.end
                  );

                  if (lessonsAtSameTime.length === 0) return <div key={`${lessonIndex}-${dayIndex}`} className="calendar-cell"></div>;

                  return (
                    <div key={`${lessonIndex}-${dayIndex}`} className="calendar-cell">
                      {lessonsAtSameTime.map((lesson, index) => (
                        <Dialog key={`${lessonIndex}-${dayIndex}-${index}`}>
                          <DialogTrigger asChild>
                            <div
                              className={`lesson-card ${
                                isToday(day) && isCurrentLesson(lesson) ? "current-lesson" : ""
                              }`}
                              onClick={() => openModal(lesson.subject, `${lesson.start} - ${lesson.end}`)}
                            >
                              <div className="lesson-index">{lessonIndex + 1}</div>
                              <div className="lesson-name">{lesson.subject}</div>
                              <div className="lesson-name">{lesson.class}</div>
                            </div>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>{modalInfo?.lesson}</DialogTitle>
                              <DialogDescription>Időpont: {modalInfo?.time}</DialogDescription>
                            </DialogHeader>
                          </DialogContent>
                        </Dialog>
                      ))}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </>
        )}
      </div>
    </div>
  );
};


export default Calendar;
