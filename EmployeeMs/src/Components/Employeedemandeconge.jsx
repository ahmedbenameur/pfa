import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './style.css';

const Employeedemandeconge = () => {
  const [formData, setFormData] = useState({
    date_debut: '',
    date_fin: '',
    type: '',
  });
  const [error, setError] = useState(''); // État pour stocker les messages d'erreur

  const { id } = useParams();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(''); // Réinitialiser le message d'erreur lors de la modification des champs
  };

  const calculateDuree = () => {
    const dateDebut = new Date(formData.date_debut);
    const dateFin = new Date(formData.date_fin);
    const duree = Math.ceil((dateFin - dateDebut) / (1000 * 60 * 60 * 24)) + 1;
    return duree > 0 ? duree : 0;
  };

  const validateForm = () => {
    const { date_debut, date_fin, type } = formData;

    if (!date_debut || !date_fin || !type) {
      setError('All fields are required.');
      return false;
    }

    if (new Date(date_debut) >= new Date(date_fin)) {
      setError('End Date must be after the Start Date.');
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const duree = calculateDuree();

    axios.post(`http://localhost:3000/employee/demande-conge`, {
      employee_id: id,
      date_debut: formData.date_debut,
      date_fin: formData.date_fin,
      type: formData.type,
      duree: duree,
    })
      .then((response) => {
        navigate(`../employee_conge/${id}`);
      })
      .catch((error) => {
        console.error('Erreur lors de la demande de congé :', error);
        setError('Failed to submit leave request. Please try again.');
      });
  };

  return (
    <div className="demande-conge-container">
      <h2>Leave Request</h2>
      <form onSubmit={handleSubmit}>
        {error && <div className="error-message">{error}</div>}
        <div className="date-input">
          <label>Start Date:</label>
          <input type="date" name="date_debut" value={formData.date_debut} onChange={handleInputChange} />
        </div>
        <div className="date-input">
          <label>End Date:</label>
          <input type="date" name="date_fin" value={formData.date_fin} onChange={handleInputChange} />
        </div>
        <div>
          <label>Leave Type:</label>
          <div className="radio-container">
            <label>
              <input type="radio" name="type" value="Annual" checked={formData.type === 'Annual'} onChange={handleInputChange} />
              Annual
            </label>
            <label>
              <input type="radio" name="type" value="Sick" checked={formData.type === 'Sick'} onChange={handleInputChange} />
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
