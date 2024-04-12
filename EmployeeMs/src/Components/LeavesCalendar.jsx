import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import './LeavesCalendar.css';
import { eachDayOfInterval, parseISO } from 'date-fns';

const LeavesCalendar = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchLeaves = axios.get('http://localhost:3000/leader/leaveCalendar');
    const fetchTravels = axios.get('http://localhost:3000/leader/travelCalendar');

    Promise.all([fetchLeaves, fetchTravels])
      .then(([leavesResponse, travelsResponse]) => {
        const leavesData = leavesResponse.data.Result || [];
        const travelData = travelsResponse.data.Result || [];

        // Créer un objet pour compter les occurrences de chaque date
        const dateCount = {};
        leavesData.forEach(leave => {
          eachDayOfInterval({
            start: parseISO(leave.date_debut),
            end: parseISO(leave.date_fin)
          }).forEach(day => {
            const key = day.toISOString().split('T')[0]; // Utilisez seulement la date, pas le temps
            dateCount[key] = (dateCount[key] || 0) + 1;
          });
        });

        const leaveEvents = leavesData.map(leave => {
          const sharedDays = eachDayOfInterval({
            start: parseISO(leave.date_debut),
            end: parseISO(leave.date_fin)
          }).some(day => dateCount[day.toISOString().split('T')[0]] > 1);

          return {
            title: `${leave.employee_name} (Congé)`,
            start: leave.date_debut,
            end: leave.date_fin,
            allDay: true,
            color: sharedDays ? 'pink' : 'blue' // Rose pour les jours partagés, bleu sinon
          };
        });

        const travelEvents = travelData.map(travel => ({
          title: `${travel.employee_name} (Déplacement: ${travel.destination})`,
          start: travel.departure_date,
          end: travel.return_date,
          allDay: true,
          color: 'green'
        }));

        setEvents([...leaveEvents, ...travelEvents]);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <FullCalendar
      plugins={[dayGridPlugin]}
      initialView="dayGridMonth"
      events={events}
    />
  );
};

export default LeavesCalendar;
