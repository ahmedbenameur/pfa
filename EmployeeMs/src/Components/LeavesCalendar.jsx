import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import './LeavesCalendar.css';
import { eachDayOfInterval, parseISO, format } from 'date-fns';

const LeavesCalendar = () => {
  const [conges, setConges] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/leader/leaveCalendar')
      .then(response => {
        setConges(response.data.Result || []);
      })
      .catch(error => {
        console.error('There was an error fetching the leave data:', error);
      });
  }, []);

  // Suivi du nombre d'employés en congé par jour
  let dayCounts = {};

  // Première passe pour calculer les jours de congé
  conges.forEach(conge => {
    eachDayOfInterval({ start: parseISO(conge.date_debut), end: parseISO(conge.date_fin) })
      .forEach(day => {
        const dayStr = format(day, 'yyyy-MM-dd');
        dayCounts[dayStr] = (dayCounts[dayStr] || 0) + 1;
      });
  });

  // Transformation des données de congé pour FullCalendar avec ajustement de la couleur
  const events = conges.map(conge => {
    let sharedDays = eachDayOfInterval({ start: parseISO(conge.date_debut), end: parseISO(conge.date_fin) })
      .some(day => dayCounts[format(day, 'yyyy-MM-dd')] > 1);

    return {
      title: `${conge.employee_name} (${conge.type})`,
      start: conge.date_debut,
      end: conge.date_fin,
      allDay: true,
      color: sharedDays ? 'pink' : 'blue', // Jours partagés en rouge, sinon en bleu
    };
  });

  return (
    <FullCalendar
      plugins={[dayGridPlugin]}
      initialView="dayGridMonth"
      events={events}
    />
  );
};

export default LeavesCalendar;
