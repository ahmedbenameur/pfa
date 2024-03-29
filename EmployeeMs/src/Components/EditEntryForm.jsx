import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditEntryForm = () => {
  const { entryId, id } = useParams();
  const navigate = useNavigate(); // Hook useNavigate pour la navigation

  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [totalWorked, setTotalWorked] = useState(0);
  const [savedStartTime, setSavedStartTime] = useState(''); // État pour stocker le startTime sauvegardé

  useEffect(() => {
    const fetchTimeEntry = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/employee/timeentries/${entryId}`);
        console.log('Time entry data:', response.data); // Ajouter ce log pour vérifier les données récupérées
        const { start_time, end_time, hours_worked } = response.data.Result[0]; // Accéder à la première entrée de temps

        // Utiliser start_time de la réponse pour définir startTime
        setStartTime(start_time);
        setSavedStartTime(start_time); // Sauvegarder le startTime récupéré
        setEndTime(end_time || ''); // Si end_time est null, définir endTime comme une chaîne vide
        setTotalWorked(hours_worked);
      } catch (error) {
        console.error('Error fetching time entry data:', error);
      }
    };

    fetchTimeEntry();
  }, [entryId]);

  const calculateTotalWorked = (start, end) => {
    if (start && end) {
      const startDate = new Date(`2000-01-01T${start}`);
      const endDate = new Date(`2000-01-01T${end}`);

      const differenceMs = endDate - startDate; // Calculer la différence entre les heures de début et de fin en millisecondes
      const differenceHours = differenceMs / (1000 * 60 * 60) -2; // Convertir la différence en heures

      // Assurez-vous que le temps total travaillé n'est pas négatif
      return Math.max(0, Math.round(differenceHours * 100) / 100);
    }
    return 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Calculer le totalWorked en fonction de startTime et endTime
      const newTotalWorked = calculateTotalWorked(savedStartTime, endTime); // Utiliser le startTime sauvegardé

      console.log('Data to be sent for entry update:', { entryId, startTime: savedStartTime, endTime, totalWorked: newTotalWorked });

      // Envoyer les données à votre endpoint de mise à jour
      await axios.put(`http://localhost:3000/employee/editpointage/${entryId}`, {
        endTime,
        totalWorked: newTotalWorked
      });

      console.log('Entry updated successfully!');
      // Rediriger l'utilisateur vers la page principale ou une autre page appropriée
      navigate(`/employeedashboard/${id}/WorkTimeTracking`);
    } catch (error) {
      console.error('Error updating entry:', error);
    }
  };

  return (
    <div>
      <h2>Edit Entry</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="endTime">End Time:</label>
          <input
            type="time"
            id="endTime"
            value={endTime ? endTime.substring(0, 5) : ''} // Vérifiez si endTime n'est pas null avant d'accéder à ses propriétés
            onChange={(e) => {
              const newEndTime = e.target.value ? `${e.target.value}:00` : ''; // Vérifiez si la valeur de l'input n'est pas vide avant de modifier endTime
              setEndTime(newEndTime);
              const newTotalWorked = calculateTotalWorked(savedStartTime, newEndTime);
              setTotalWorked(newTotalWorked);
            }}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default EditEntryForm;
