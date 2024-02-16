import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './style.css';

const Employeedemandeconge = () => {
  const [formData, setFormData] = useState({
    date_debut: '',
    date_fin: '',
    type: '', // Ne pas initialiser le type
  });

  const { id } = useParams();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCheckboxChange = (e) => {
    setFormData({
      ...formData,
      type: e.target.checked ? 'annuel' : 'maladie',
    });
  };

  const calculateDuree = () => {
    const dateDebut = new Date(formData.date_debut);
    const dateFin = new Date(formData.date_fin);
    const duree = Math.ceil((dateFin - dateDebut) / (1000 * 60 * 60 * 24));
    return duree;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const duree = calculateDuree();

    // Envoyer la demande de congé au backend
    axios.post(`http://localhost:3000/employee/demande-conge`, {
      employee_id: id,
      date_debut: formData.date_debut,
      date_fin: formData.date_fin,
      type: formData.type,
      duree: duree,
    })
      .then((response) => {
        console.log(response.data);
        // Gérer la réponse du serveur (succès ou échec)

        // Naviguer vers la page des congés de l'employé
        navigate(`../employee_conge/${id}`);
      })
      .catch((error) => {
        console.error('Erreur lors de la demande de congé :', error);
        // Gérer les erreurs
      });
  };

  return (
    <div className="demande-conge-container">
  <h2>Leave Request</h2>
  <form onSubmit={handleSubmit}>
    <div className="date-input">
      <label>Start Date:</label>
      <input type="date" name="date_debut" onChange={handleInputChange} />
    </div>
    <div className="date-input">
      <label>End Date:</label>
      <input type="date" name="date_fin" onChange={handleInputChange} />
    </div>
    <div>
      <label>Leave Type:</label>
      <div className="radio-container">
        <label>
          <input type="radio" name="type" value="annuel" onChange={handleInputChange} />
          Annual
        </label>
        <label>
          <input type="radio" name="type" value="maladie" onChange={handleInputChange} />
          Sick
        </label>
      </div>
    </div>
    <button type="submit">Submit Request</button>
  </form>
</div>

  );
};

export default Employeedemandeconge;
