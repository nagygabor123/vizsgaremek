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

const testSchedule: { [date: string]: string[] } = {
  "2024-11-18": ["Matematika", "Történelem", "", "Fizika", "Biológia", "", "Földrajz", "Ének", ""],
  "2024-11-19": ["Irodalom", "Matematika", "Informatika", "Történelem", "Angol", "Kémia", "Biológia", "Fizika", "Testnevelés"],
  "2024-11-20": ["Angol", "Matematika és az meg Hogy szeretm", "", "Irodalom", "Földrajz", "Történelem", "Fizika", "Informatika", ""],
  "2024-11-14": ["Testnevelés", "Ének", "Irodalom", "Angol", "Történelem", "", "", "Fizika", "Biológia"],
  "2024-11-15": ["Informatika és Távközlési alapok és az meg", "Földrajz", "Matematika", "Biológia", "Irodalom", "Angol", "Kémia", "Történelem", "Fizika"],
  "2024-11-16": ["", "", "", "", "", "", "Kémia", "", ""],

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

  const isCurrentLesson = (lessonIndex: number) => {
    const now = new Date();
    const [startHour, startMinute] = lessonTimes[lessonIndex].start.split(':').map(Number);
    const [endHour, endMinute] = lessonTimes[lessonIndex].end.split(':').map(Number);

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
            <div className="calendar-day">{format(currentDate, "eeee d", { locale: hu })}</div>
            {Array.from({ length: 9 }, (_, i) => {
  const lesson = testSchedule[format(currentDate, "yyyy-MM-dd")]?.[i];
  if (!lesson) return null; // Ha nincs óra, ne jelenjen meg kártya
  return (
    <Dialog key={i}>
      <DialogTrigger asChild>
        <div
          className={`calendar-cell lesson-card ${isCurrentLesson(i) ? "current-lesson" : ""}`}
          onClick={() => openModal(lesson, `${lessonTimes[i].start} - ${lessonTimes[i].end}`)}
        >
          <div className="lesson-number">{i + 1}. óra</div> {/* Óraszám megjelenítése */}
          <div className="lesson-name">{lesson}</div>
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
{Array.from({ length: 9 }, (_, lessonIndex) => (
  <React.Fragment key={lessonIndex}>
    <div className="lesson-number">{lessonIndex + 1}. óra</div>
    {daysOfWeek.map((day, index) => {
      const lesson = testSchedule[format(day, "yyyy-MM-dd")]?.[lessonIndex];
      if (!lesson) return <div key={`${lessonIndex}-${index}`} className="calendar-cell"></div>; // Ha nincs óra, üres cellát jeleníts meg
      return (
        <Dialog key={`${lessonIndex}-${index}`}>
          <DialogTrigger asChild>
            <div
              className={`calendar-cell lesson-card ${
                isToday(day) && isCurrentLesson(lessonIndex) ? "current-lesson" : ""
              }`}
              onClick={() => openModal(lesson, `${lessonTimes[lessonIndex].start} - ${lessonTimes[lessonIndex].end}`)}
            >
              <div className="lesson-number">{lessonIndex + 1}. óra</div> {/* Óraszám megjelenítése */}
              <div className="lesson-name">{lesson}</div>
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
))}

          </>
        )}
      </div>
    </div>
  );
};

export default Calendar;
