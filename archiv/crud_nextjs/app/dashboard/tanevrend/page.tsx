'use client';

import { useState, useEffect } from 'react';

const Configuration = () => {
  const [message, setMessage] = useState<string>('');
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [yearSchedule, setYearSchedule] = useState<any>({
    plusDates: [],
    breakDates: [],
    schoolStart: '',
    schoolEnd: ''
  });
  const [schoolStartEdit, setSchoolStartEdit] = useState('');
  const [schoolEndEdit, setSchoolEndEdit] = useState('');
  const [newBreak, setNewBreak] = useState({ nev: '', which_day: '', replace_day: '' });
  const [newPlusDate, setNewPlusDate] = useState({  nev: '', which_day: '', replace_day: '' });
  const days = [
    { label: 'Hétfő', value: 'monday' },
    { label: 'Kedd', value: 'tuesday' },
    { label: 'Szerda', value: 'wednesday' },
    { label: 'Csütörtök', value: 'thursday' },
    { label: 'Péntek', value: 'friday' },
    { label: 'Szombat', value: 'saturday' },
    { label: 'Vasárnap', value: 'sunday' },
  ];

    const fetchYearSchedule = async () => {
      try {
        const plusRes = await fetch('http://localhost:3000/api/config/getYearSchedule?type=plusznap');
        const szunetRes = await fetch('http://localhost:3000/api/config/getYearSchedule?type=szunet');
        const startRes = await fetch('http://localhost:3000/api/config/getYearSchedule?type=kezd');
        const endRes = await fetch('http://localhost:3000/api/config/getYearSchedule?type=veg');

        const plusDates = await plusRes.json();
        const breakDates = await szunetRes.json();
        const schoolStart = await startRes.json();
        const schoolEnd = await endRes.json();

        setYearSchedule({
          plusDates: plusDates.plusDates_alap,
          breakDates: breakDates.breakDates_alap,
          schoolStart: schoolStart.schoolYearStart.start,
          schoolEnd: schoolEnd.schoolYearEnd.end
        });
        setSchoolStartEdit(schoolStart.schoolYearStart.start);
        setSchoolEndEdit(schoolEnd.schoolYearEnd.end);
      } catch (error) {
        console.error('Error fetching year schedule:', error);
      }
    };

  useEffect(() => {
    fetchYearSchedule();
  }, []);

  const updateSchoolYear = async (type: string, date: string) => {
    try {
      console.log('Küldött adatok:', { type, which_day: date });
  
      const response = await fetch('http://localhost:3000/api/config/setYearStartEnd', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type, which_day: date }),
      });
  
      const responseData = await response.json();
      console.log('API válasz:', responseData);
  
      if (response.ok) {
        setMessage(`${type === 'kezd' ? 'Tanév kezdete' : 'Tanév vége'} sikeresen frissítve!`);
  
        setYearSchedule({
          ...yearSchedule,
          schoolStart: type === 'kezd' ? date : yearSchedule.schoolStart,
          schoolEnd: type === 'veg' ? date : yearSchedule.schoolEnd
        });
        
        
      } else {
        setMessage('Hiba történt az adat frissítésekor.');
      }
    } catch (error) {
      setMessage(`Hiba: ${error}`);
    }
  };
  
  const handleAddBreak = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/config/addPlusBreak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'szunet', ...newBreak })
      });
      if (response.ok) {
        setYearSchedule((prev: typeof yearSchedule) => ({
          ...prev,
          breakDates: [...prev.breakDates, newBreak]
        }));
        setNewBreak({ nev: '', which_day: '', replace_day: '' });
        await fetchYearSchedule();  
      }
    } catch (error) {
      console.error('Error updating break:', error);
    }
  };
  
  const handleAddPlusDate = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/config/addPlusBreak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'plusznap', ...newPlusDate })
      });
      if (response.ok) {
        setYearSchedule((prev: typeof yearSchedule) => ({
          ...prev,
          plusDates: [...prev.plusDates, newPlusDate]
        }));
        setNewPlusDate({ nev: '', which_day: '', replace_day: '' });
        await fetchYearSchedule();  
      }
    } catch (error) {
      console.error('Error updating plus date:', error);
    }
  };

  const handleDeletePlusBreak = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3000/api/config/deletePlusBreak?year_schedule_id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessage('A rekord sikeresen törölve.');
        setYearSchedule((prev: typeof yearSchedule) => ({
          ...prev,
          breakDates: prev.breakDates.filter((breakPeriod: any) => breakPeriod.id !== id),
          plusDates: prev.plusDates.filter((plusDate: any) => plusDate.id !== id),
        }));
      } else {
        setMessage('Hiba történt a törlés során.');
      }
    } catch (error) {
      console.error('Hiba a törlés során:', error);
      setMessage('Hiba történt a törlés során.');
    }
  };

 


  

  
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      {message && (
        <p style={{ marginTop: '20px', color: message.startsWith('Error') ? 'red' : 'green' }}>
          {message}
        </p>
      )}
      {apiResponse && (
        <pre style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f8f9fa', border: '1px solid #ddd', borderRadius: '5px' }}>
          {JSON.stringify(apiResponse, null, 2)}
        </pre>
      )}
      <h2>Tanév beállítása</h2>

      <label>Tanév kezdete:</label>
      <input
        type="date"
        value={schoolStartEdit}
        onChange={(e) => setSchoolStartEdit(e.target.value)}
      />
      <button onClick={() => updateSchoolYear('kezd', schoolStartEdit)}>Mentés</button>

      <br></br> 

      <label>Tanév vége:</label>
      <input
        type="date"
        value={schoolEndEdit}
        onChange={(e) => setSchoolEndEdit(e.target.value)}
      />
      <button onClick={() => updateSchoolYear('veg', schoolEndEdit)}>Mentés</button>
      
      <h3>Szünetek</h3>
      {yearSchedule.breakDates.length > 0 ? (
        <ul>
          {yearSchedule.breakDates.map((breakPeriod: any, index: number) => (
            <li key={index}>
              {breakPeriod.id} {breakPeriod.name}: {breakPeriod.start} - {breakPeriod.end}     
              <button onClick={() => handleDeletePlusBreak(breakPeriod.id)}>Törlés</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>Nincsenek szünetek.</p>
      )}
      <input
        type="text"
        placeholder="Szünet neve"
        value={newBreak.nev}
        onChange={(e) => setNewBreak({ ...newBreak, nev: e.target.value })}
      />
      <input
        type="date"
        value={newBreak.which_day}
        onChange={(e) => setNewBreak({ ...newBreak, which_day: e.target.value })}
      />
      <input
        type="date"
        value={newBreak.replace_day}
        onChange={(e) => setNewBreak({ ...newBreak, replace_day: e.target.value })}
      />
      <button onClick={handleAddBreak}>Új szünet hozzáadása</button>

      <h3>Plusz napok</h3>
      {yearSchedule.plusDates.length > 0 ? (
        <ul>
          {yearSchedule.plusDates.map((plusDate: any, index: number) => (
            <li key={index}>
              {plusDate.id} {plusDate.name}: {plusDate.date} - {plusDate.replaceDay}
              <button onClick={() => handleDeletePlusBreak(plusDate.id)}>Törlés</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>Nincsenek plusz napok.</p>
      )}
      <input
        type="text"
        placeholder="Plusz nap neve"
        value={newPlusDate.nev}
        onChange={(e) => setNewPlusDate({ ...newPlusDate, nev: e.target.value })}
      />
      <input
        type="date"
        value={newPlusDate.which_day}
        onChange={(e) => setNewPlusDate({ ...newPlusDate, which_day: e.target.value })}
      />
      <select
        id="replace_day"
        value={newPlusDate.replace_day}
        onChange={(e) => setNewPlusDate({ ...newPlusDate, replace_day: e.target.value })}
      >
        {days.map((day) => (
          <option key={day.value} value={day.value}>
            {day.label}
          </option>
        ))}
      </select>
      <button onClick={handleAddPlusDate}>Új plusz nap hozzáadása</button>
    </div>
  );
};

export default Configuration;
