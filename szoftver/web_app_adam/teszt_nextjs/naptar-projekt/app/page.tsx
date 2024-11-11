'use client';

import React from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, addMonths } from 'date-fns';
import { enUS } from 'date-fns/locale'; // Importáljuk a helyi beállítást

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = React.useState(new Date());

  // Hétfőt állítjuk be a hét első napjának
  const startOfCalendar = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 1 }); // 1 a hétfőt jelenti
  const endOfCalendar = endOfMonth(currentDate);

  // Minden nap listája az adott hónapban, beleértve a hétnapok kitöltését is
  const days = eachDayOfInterval({ start: startOfCalendar, end: endOfCalendar });

  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const handlePreviousMonth = () => setCurrentDate(addMonths(currentDate, -1));

  return (
    <div style={{ padding: '20px' }}>
      <h1>Naptár</h1>
      <div>
        <button onClick={handlePreviousMonth}>Előző hónap</button>
        <span style={{ margin: '0 10px' }}>{format(currentDate, 'yyyy MMMM')}</span>
        <button onClick={handleNextMonth}>Következő hónap</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '5px', marginTop: '10px' }}>
        {['Hétfő', 'Kedd', 'Szerda', 'Csütörtök', 'Péntek', 'Szombat', 'Vasárnap'].map(day => (
          <div key={day} style={{ textAlign: 'center', fontWeight: 'bold' }}>{day}</div>
        ))}

        {days.map(day => (
          <div key={format(day, 'yyyy-MM-dd')} style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>
            {format(day, 'd')}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
