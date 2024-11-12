'use client';

import React, { useEffect, useRef } from 'react';
import { format, addDays, startOfWeek, addWeeks, isToday } from 'date-fns';

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const todayRef = useRef<HTMLDivElement | null>(null);

  const startOfCalendarWeek = startOfWeek(currentDate, { weekStartsOn: 1 });

  const handleNextWeek = () => setCurrentDate(addWeeks(currentDate, 1));
  const handlePreviousWeek = () => setCurrentDate(addWeeks(currentDate, -1));

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startOfCalendarWeek, i));
  const lessons = Array.from({ length: 9 }, (_, i) => i + 1);

  useEffect(() => {
    todayRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, []);

  return (
    <div className="calendar-container">
      <h1>Órarend</h1>
      <div className="calendar-controls">
        <button onClick={handlePreviousWeek}>Előző hét</button>
        <button onClick={handleNextWeek}>Következő hét</button>
      </div>

      <div className="calendar-grid">
        <div></div>
        
        {weekDays.map(day => {
          const isCurrentDay = isToday(day);
          return (
            <div
              key={format(day, 'yyyy-MM-dd')}
              className={`calendar-day ${isCurrentDay ? 'current-day' : ''}`}
              ref={isCurrentDay ? todayRef : null}
            >
              {format(day, 'EEEE')}<br />{format(day, 'MM-dd')}
            </div>
          );
        })}

        {lessons.map(lesson => (
          <React.Fragment key={lesson}>
            <div className="lesson-number">{lesson}. óra</div>
            {weekDays.map(day => (
              <div key={`${format(day, 'yyyy-MM-dd')}-${lesson}`} className="calendar-cell">
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
