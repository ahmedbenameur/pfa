import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import moment from 'moment';
import './style.css';

const EmployeeDemandeSortie = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    heureDebut: '',
    heureFin: '',
    description: '',
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    // Calcul de la durée lors du changement de l'heure de début ou de fin
    if (e.target.name === 'heureDebut' || e.target.name === 'heureFin') {
      calculateDuration();
    }
  };

  // Calculer la durée à partir de l'heure de début et de l'heure de fin
  const calculateDuration = () => {
    const start = moment(formData.heureDebut, 'HH:mm');
    const end = moment(formData.heureFin, 'HH:mm');
    const durationInHours = end.diff(start, 'hours', true);
    return durationInHours;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const duree = calculateDuration();

    // Utiliser la durée directement calculée dans le formulaire
    axios.post(`http://localhost:3000/employee/demande-sortie`, {
      employee_id: id,
      date: new Date().toISOString().split('T')[0],
      heure_debut: formData.heureDebut,
      heure_fin: formData.heureFin,
      description: formData.description,
      duree: duree, // Utiliser la durée calculée
    })
    .then((response) => {
      console.log(response.data);
      // Gérer la réponse du serveur (succès ou échec)

      // Naviguer vers la page des sorties de l'employé (EmployeeSortie)
      navigate(`../employee_sortie/${id}`);
    })
    .catch((error) => {
      console.error('Erreur lors de la demande de sortie :', error);

      // Afficher un message d'erreur ou effectuer d'autres actions en cas d'échec
      // Exemple : setState pour afficher un message d'erreur à l'utilisateur
    });
  };

  return (
    <div className="container mt-5 employee-demande-sortie-container">
      <h2 className="mb-4 text-primary">Exit Request Form</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="heureDebut" className="form-label">Start Time:</label>
          <input
            type="time"
            className="form-control"
            id="heureDebut"
            name="heureDebut"
            value={formData.heureDebut}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="heureFin" className="form-label">End Time:</label>
          <input
            type="time"
            className="form-control"
            id="heureFin"
            name="heureFin"
            value={formData.heureFin}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description:</label>
          <textarea
            className="form-control"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary">Submit Request</button>
      </form>
    </div>
  );
};

export default EmployeeDemandeSortie;
