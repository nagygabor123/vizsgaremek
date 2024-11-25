'use client';

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

const breakDates = [
  { start: '2024-12-20', end: '2025-01-05' },
];

const plusDates = [
  { date: '2024-12-07', replaceDay: 'monday' },
];

const getDayName = (date: Date): string => {
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return dayNames[getDay(date)];
};

const isBreakDay = (date: Date) => {
  const targetDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return breakDates.some(({ start, end }) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return targetDate >= startDate && targetDate <= endDate;
  });
};

const getReplacedDayName = (date: Date): string => {
  const formattedDate = format(date, 'yyyy-MM-dd');
  const replacement = plusDates.find((entry) => entry.date === formattedDate);
  return replacement ? replacement.replaceDay : getDayName(date);
};

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isMobileView, setIsMobileView] = useState(false);
  const [schedule, setSchedule] = useState<TimetableEntry[]>([]);
  const [modalInfo, setModalInfo] = useState<{ lesson: string; time: string } | null>(null);

  useEffect(() => {
    const updateView = () => {
      setIsMobileView(window.innerWidth <= 920);
    };

    updateView();
    window.addEventListener('resize', updateView);
    return () => window.removeEventListener('resize', updateView);
  }, []);

  useEffect(() => {
    async function fetchSchedule() {
      try {
        const response = await fetch('http://localhost:3000/api/timetable/admin'); // vagy az API végpontod
        const data = await response.json();
        const formattedData = data.map((lesson: any) => ({
          day: lesson.day_of_week,
          start: lesson.start_time.slice(0, 5),
          end: lesson.end_time.slice(0, 5),
          subject: lesson.group_name,
          teacher: lesson.teacher_name,
          class: lesson.class,
        }));
        setSchedule(formattedData);
      } catch (error) {
        console.error('Error fetching schedule:', error);
      }
    }

    fetchSchedule();
  }, []);

  console.log('Schedule:', schedule);

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

  const openModal = (lesson: string, time: string) => {
    setModalInfo({ lesson, time });
  };

  const closeModal = () => {
    setModalInfo(null);
  };

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const daysOfWeek = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const replacedDayName = getReplacedDayName(currentDate);
  const dailyLessons = schedule.filter((lesson) => lesson.day === replacedDayName);

  return (
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
            <div className="calendar-day">{format(currentDate, 'eeee d', { locale: hu })}</div>
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
                    {lessonsAtSameTime.map((lesson, index) => (
                      <Dialog key={index}>
                        <DialogTrigger asChild>
                          <div
                            className={`lesson-card ${
                              isToday(currentDate) && isCurrentLesson(lesson) ? 'current-lesson' : ''
                            }`}
                            onClick={() => openModal(lesson.subject, `${lesson.start} - ${lesson.end}`)}
                          >
                            <div className="lesson-index">{lessonIndex + 1}</div>
                            <div className="lesson-name">{lesson.subject}</div>
                            <div className="lesson-class">{lesson.class}</div>
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
                    (l) => l.start === time.start && l.end === time.end
                  );

                  const isBreak = isBreakDay(day);
                  if (lessonsAtSameTime.length === 0 || isBreak) {
                    return <div key={`${lessonIndex}-${dayIndex}`} className="calendar-cell empty" />;
                  }

                  return (
                    <div key={`${lessonIndex}-${dayIndex}`} className="calendar-cell">
                      {lessonsAtSameTime.map((lesson, index) => (
                        <Dialog key={`${lessonIndex}-${dayIndex}-${index}`}>
                          <DialogTrigger asChild>
                            <div
                              className={`lesson-card ${
                                isToday(day) && isCurrentLesson(lesson) ? 'current-lesson' : ''
                              }`}
                              onClick={() =>
                                openModal(lesson.subject, `${lesson.start} - ${lesson.end}`)
                              }
                            >
                              <div className="lesson-index">{lessonIndex + 1}</div>
                              <div className="lesson-name">{lesson.subject}</div>
                              <div className="lesson-class">{lesson.class}</div>
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
