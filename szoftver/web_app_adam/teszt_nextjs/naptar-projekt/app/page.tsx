// app/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { format, startOfWeek, addDays, subDays, addWeeks } from 'date-fns';
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

  return (
    <div className="calendar-container">
      <div className="calendar-controls">
        <button onClick={goToPrevious}>
          {isMobileView ? "Előző nap" : "Előző hét"}
        </button>
        <span>{format(currentDate, "yyyy MMMM d")}</span>
        <button onClick={goToNext}>
          {isMobileView ? "Következő nap" : "Következő hét"}
        </button>
      </div>

      <div className="calendar-grid">
        {isMobileView ? (
          <div>
            <div className="calendar-day">{format(currentDate, "EEEE")}</div>
            {Array.from({ length: 9 }, (_, i) => (
              <div className="calendar-cell" key={i}>
                {/* Ellenőrizzük, hogy létezik-e adat az adott dátumra */}
                {testSchedule[format(currentDate, "yyyy-MM-dd")]?.[i] || "Nincs óra"}
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="calendar-day"></div>
            {daysOfWeek.map((day, index) => (
              <div
                className={`calendar-day ${format(day, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd") ? 'current-day' : ''}`}
                key={index}
              >
                {format(day, "EEE d")}
              </div>
            ))}
            {Array.from({ length: 9 }, (_, lessonIndex) => (
              <React.Fragment key={lessonIndex}>
                <div className="lesson-number">{lessonIndex + 1}. óra</div>
                {daysOfWeek.map((day, index) => (
                  <div className="calendar-cell" key={`${lessonIndex}-${index}`}>
                    {/* Ellenőrizzük, hogy létezik-e adat az adott dátumra */}
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
