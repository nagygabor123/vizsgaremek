// app/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { format, startOfWeek, addDays, subDays, addWeeks, isToday, isAfter, isBefore } from 'date-fns';
import { hu } from 'date-fns/locale';
import './globals.css';

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const testSchedule: { [date: string]: { subject: string; start: string; end: string }[] } = {
  "2024-11-18": [
    { subject: "Matematika", start: "07:15", end: "08:00" },
    { subject: "Történelem", start: "08:10", end: "08:55" },
    { subject: "Fizika", start: "10:00", end: "10:45" },
    { subject: "Biológia", start: "10:55", end: "11:40" },
    { subject: "Földrajz", start: "12:55", end: "13:40" },
    { subject: "Ének", start: "13:45", end: "14:30" },
    { subject: "fasz", start: "14:35", end: "15:20" },
  ],
  // További napok...
};

const lessonTimes = [
  { start: '07:15', end: '08:00' },
  { start: '08:10', end: '08:55' },
  { start: '09:05', end: '09:50' },
  { start: '10:00', end: '10:45' },
  { start: '10:55', end: '11:40' },
  { start: '11:50', end: '12:35' },
  { start: '12:55', end: '13:40' },
  { start: '13:45', end: '14:30' },
  { start: '14:35', end: '15:20' },
];

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isMobileView, setIsMobileView] = useState(false);
  const [modalInfo, setModalInfo] = useState<{ lesson: string; time: string } | null>(null);

  useEffect(() => {
    const updateView = () => {
      setIsMobileView(window.innerWidth <= 480);
    };

    updateView();
    window.addEventListener("resize", updateView);
    return () => window.removeEventListener("resize", updateView);
  }, []);

  const goToPrevious = () => {
    setCurrentDate(prevDate => isMobileView ? subDays(prevDate, 1) : addWeeks(prevDate, -1));
  };

  const goToNext = () => {
    setCurrentDate(prevDate => isMobileView ? addDays(prevDate, 1) : addWeeks(prevDate, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const daysOfWeek = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const isCurrentLesson = (lesson: { start: string; end: string }) => {
    const now = new Date();
    const [startHour, startMinute] = lesson.start.split(':').map(Number);
    const [endHour, endMinute] = lesson.end.split(':').map(Number);
  
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
    {/* A jelenlegi nap neve és dátuma */}
    <div className="calendar-day">{format(currentDate, "eeee d", { locale: hu })}</div>

    {/* Az órák megjelenítése az adott nap alapján */}
    {Array.from({ length: lessonTimes.length }, (_, lessonIndex) => {
      const dailyLessons = testSchedule[format(currentDate, "yyyy-MM-dd")] || [];
      const lesson = dailyLessons.find(
        (l) =>
          l.start === lessonTimes[lessonIndex].start &&
          l.end === lessonTimes[lessonIndex].end
      );

      if (!lesson || !lesson.subject) return null; // Ha nincs óra, ne jelenjen meg semmi

      return (
        <Dialog key={lessonIndex}>
          <DialogTrigger asChild>
            <div
              className={`calendar-cell lesson-card ${
                isToday(currentDate) && isCurrentLesson(lesson) ? "current-lesson" : ""
              }`}
              onClick={() => openModal(lesson.subject, `${lesson.start} - ${lesson.end}`)}
            >
              <div className="lesson-index">{lessonIndex + 1}</div>
              <div className="lesson-name">{lesson.subject}</div>
              {/* <div className="lesson-time">{`${lesson.start} - ${lesson.end}`}</div> */}
            </div>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{modalInfo?.lesson}</DialogTitle>
              <DialogDescription>Időpont: {modalInfo?.time}</DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      );
    })}
  </div>

        ) : (
          <>
            <div className="calendar-day"></div>
            {daysOfWeek.map((day, index) => (
              <div className={`calendar-day ${isToday(day) ? 'current-day' : ''}`} key={index}>
                {format(day, "EEE d", { locale: hu })}
              </div>
            ))}


{Array.from({ length: lessonTimes.length }, (_, lessonIndex) => {
  return (
    <React.Fragment key={lessonIndex}>
      <div className="lesson-time">
        <span className="time-start">{lessonTimes[lessonIndex].start}</span>
        <span className="time-end">{lessonTimes[lessonIndex].end}</span>
      </div>
      {daysOfWeek.map((day, index) => {
        const dailyLessons = testSchedule[format(day, "yyyy-MM-dd")] || [];
        const lesson = dailyLessons.find(
          (l) =>
            l.start === lessonTimes[lessonIndex].start &&
            l.end === lessonTimes[lessonIndex].end
        );

        if (!lesson || !lesson.subject) return <div key={`${lessonIndex}-${index}`} className="calendar-cell"></div>;

        return (
          <Dialog key={`${lessonIndex}-${index}`}>
            <DialogTrigger asChild>
              <div
                className={`calendar-cell lesson-card ${
                  isToday(day) && isCurrentLesson(lesson) ? "current-lesson" : ""
                }`}
                onClick={() => openModal(lesson.subject, `${lesson.start} - ${lesson.end}`)}
              >
                <div className="lesson-index">{lessonIndex + 1}</div>
                <div className="lesson-name">{lesson.subject}</div>
              </div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{modalInfo?.lesson}</DialogTitle>
                <DialogDescription>Időpont: {modalInfo?.time}</DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        );
      })}
    </React.Fragment>
  );
})}



          </>
        )}
      </div>
    </div>
  );
};

export default Calendar;
