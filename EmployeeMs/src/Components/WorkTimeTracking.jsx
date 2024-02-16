import React, { useState } from 'react';
import QRCode from 'qrcode.react';

const WorkTimeTracking = () => {
  const [timeEntries, setTimeEntries] = useState([]);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const handleClockIn = () => {
    const currentStartTime = new Date().toLocaleTimeString();
    setStartTime(currentStartTime);
  };

  const handleClockOut = () => {
    const currentEndTime = new Date().toLocaleTimeString();
    setEndTime(currentEndTime);

    // Vérifiez si un pointage a déjà été effectué aujourd'hui
    const today = new Date().toLocaleDateString();
    const hasEntryToday = timeEntries.some(entry => entry.date === today);

    if (!hasEntryToday) {
      // Enregistrez l'entrée de temps dans la liste
      const entry = {
        startTime,
        endTime: currentEndTime,
        date: today,
      };
      setTimeEntries([...timeEntries, entry]);

      // Réinitialisez les temps de début et de fin
      setStartTime('');
      setEndTime('');
    } else {
      alert('Vous avez déjà enregistré un pointage aujourd\'hui.');
    }
  };

  return (
    <div>
      <h2>Real-time Work Time Tracking</h2>
      <div>
        <div>
          <strong>Start Time:</strong> {startTime || 'Not clocked in'}
        </div>
        <div>
          <strong>End Time:</strong> {endTime || 'Not clocked out'}
        </div>
        <button onClick={handleClockIn} disabled={!!startTime}>
          Clock In
        </button>
        <button onClick={handleClockOut} disabled={!startTime || !!endTime}>
          Clock Out
        </button>
      </div>
      {timeEntries.length > 0 && (
        <div>
          <h3>Time Entries:</h3>
          <ul>
            {timeEntries.map((entry, index) => (
              <li key={index}>
                <strong>Start Time:</strong> {entry.startTime} |{' '}
                <strong>End Time:</strong> {entry.endTime} |{' '}
                <strong>Date:</strong> {entry.date}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div>
        {/* Générez le code QR pour les entrées de temps */}
        {timeEntries.map((entry, index) => (
          <div key={index}>
            <QRCode value={`${entry.startTime}-${entry.endTime}-${entry.date}`} />
            <p>Date: {entry.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkTimeTracking;
