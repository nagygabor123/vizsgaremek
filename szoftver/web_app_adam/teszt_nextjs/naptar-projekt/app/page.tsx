"use client";

import React, { useState, useEffect } from 'react';
import { format, startOfWeek, addDays, subDays, addWeeks, startOfMonth } from 'date-fns';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import './globals.css';

const testSchedule: { [date: string]: string[] } = {
  "2024-11-11": ["Matematika", "Történelem", "Angol", "Kémia", "Fizika", "Biológia", "Testnevelés", "Földrajz", "Ének"],
  "2024-11-12": ["Irodalom", "Matematika", "Informatika", "Történelem", "Angol", "Kémia", "Biológia", "Fizika", "Testnevelés"],
  "2024-11-13": ["Angol", "Matematika", "Biológia", "Irodalom", "Kémia", "Földrajz", "Történelem", "Fizika", "Informatika"],
  "2024-11-14": ["Testnevelés", "Ének", "Irodalom", "Angol", "Történelem", "Matematika", "Kémia", "Fizika", "Biológia"],
  "2024-11-15": ["Informatika", "Földrajz", "Matematika", "Biológia", "Irodalom", "Angol", "Kémia", "Történelem", "Fizika"],
};

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isMobileView, setIsMobileView] = useState(false);

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

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const daysOfWeek = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const currentMonth = startOfMonth(currentDate);

  return (
    <div className="calendar-container">
      <div className="calendar-controls">
        <Button onClick={goToPrevious}>
          {isMobileView ? "Előző nap" : "Előző hét"}
        </Button>
        {/* Hónap neve a naptár jobb oldalán */}
        <div className="calendar-month">
          {format(currentMonth, "yyyy MMMM")}
        </div>
        <Button onClick={goToNext}>
          {isMobileView ? "Következő nap" : "Következő hét"}
        </Button>
      </div>

      <div className={`calendar-grid ${isMobileView ? 'mobile' : ''}`}>
        {isMobileView ? (
          <Card className="calendar-day">
            <div className="day-name">{format(currentDate, "EEEE")}</div>
            {Array.from({ length: 9 }, (_, i) => (
              <div className="calendar-cell" key={i}>
                {testSchedule[format(currentDate, "yyyy-MM-dd")]?.[i] || "Nincs óra"}
              </div>
            ))}
          </Card>
        ) : (
          <>
            {/* A bal oldalon üres oszlop a napokhoz */}
            <div className="calendar-day"></div>
            {daysOfWeek.map((day, index) => (
              <div
                className={`calendar-day ${format(day, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd") ? 'current-day' : ''}`}
                key={index}
              >
                {format(day, "EEE d")}
              </div>
            ))}
            {/* Órák */}
            {Array.from({ length: 9 }, (_, lessonIndex) => (
              <React.Fragment key={lessonIndex}>
                <div className="lesson-number">{lessonIndex + 1}. óra</div>
                {daysOfWeek.map((day, index) => (
                  <div className="calendar-cell" key={`${lessonIndex}-${index}`}>
                    {testSchedule[format(day, "yyyy-MM-dd")]?.[lessonIndex] || "Nincs óra"}
                  </div>
                ))}
              </React.Fragment>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default Calendar;
