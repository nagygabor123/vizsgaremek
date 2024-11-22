'use client';


import { useState, useEffect } from 'react';

interface TimetableEntry {
    day_of_week: string;
    start_time: string;
    end_time: string;
    group_name: string;
    teacher_name: string;
}

const Timetable = () => {
    const [schedule, setSchedule] = useState<TimetableEntry[]>([]);  // Specify the type here

    useEffect(() => {
        fetch('http://localhost:3000/api/timetable/admin')
            .then((response) => response.json())
            .then((data) => setSchedule(data))
            .catch((error) => console.error('Error fetching schedule:', error));
    }, []);

    return (
        <div>
            <h1>Class Timetable</h1>
            <div>
                {schedule.map((lesson, index) => (
                    <div key={index}>
                        <p>{lesson.day_of_week}</p>
                        <p>{lesson.start_time} - {lesson.end_time}</p>
                        <p>{lesson.group_name}</p>
                        <p>Teacher: {lesson.teacher_name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Timetable;