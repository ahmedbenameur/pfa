import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import Chart from 'chart.js/auto';

const EmployeeConge = () => {
  const { id } = useParams();
  const [conges, setConges] = useState([]);
  const [maladieDays, setMaladieDays] = useState(24);
  const [annuelleDays, setAnnuelleDays] = useState(24);

  const fetchConges = async () => {
    try {
      // Appeler la route pour récupérer les congés de l'employé
      const response = await axios.get(`http://localhost:3000/employee/conges/${id}`);
      setConges(response.data.conges || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des congés de l\'employé :', error);
    }
  };

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  useEffect(() => {
    // Mettre à jour les graphiques lorsque les jours de congé changent
    const maladieChart = new Chart(document.getElementById('maladieChart'), {
      type: 'doughnut',
      data: {
        labels: ['Congé de Maladie', 'Jours Restants'],
        datasets: [{
          data: [maladieDays, 24 - maladieDays],
          backgroundColor: ['#FF6384', '#e0e0e0'],
          hoverBackgroundColor: ['#FF6384', '#e0e0e0'],
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });

    const annuelleChart = new Chart(document.getElementById('annuelleChart'), {
      type: 'doughnut',
      data: {
        labels: ['Congé Annuel', 'Jours Restants'],
        datasets: [{
          data: [annuelleDays, 24 - annuelleDays],
          backgroundColor: ['#36A2EB', '#e0e0e0'],
          hoverBackgroundColor: ['#36A2EB', '#e0e0e0'],
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });

    // Nettoyer les graphiques lors du démontage du composant
    return () => {
      maladieChart.destroy();
      annuelleChart.destroy();
    };
  }, [maladieDays, annuelleDays]);

  useEffect(() => {
    // Appeler la route pour récupérer les congés lors du chargement du composant
    fetchConges();
  }, [id]);

  const handleReserveConge = () => {
    // Ajoutez ici la logique pour réserver un congé en utilisant les dates sélectionnées
    // Mettez à jour les jours de congé maladie et annuel après la réservation d'un congé
    setMaladieDays(maladieDays - 1);
    setAnnuelleDays(annuelleDays - 1);
  };

  return (
    <div className="container mt-5 employee-conge-container">
      <h2 className="mb-4 text-primary">Accrued Leaves</h2>
      <div className="row">
        <div className="col-md-6 pe-2">
          <div className="chart-container">
            <canvas id="maladieChart" width="150" height="150"></canvas>
          </div>
        </div>
        <div className="col-md-6 ps-2">
          <div className="chart-container">
            <canvas id="annuelleChart" width="150" height="150"></canvas>
          </div>
        </div>
      </div>
      <Link to={`/employeedashboard/${id}/employee_demande_conge`} className='btn btn-success'>
      Leave Request
      </Link>

      {/* Tableau des congés */}
      <div className="conges-table">
      <h3 style={{ marginTop: '20px' }}>Employee Leaves</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Duration</th>
              <th>Leave Type</th>
              <th>Status</th>           
            </tr>
          </thead>
          <tbody>
            {conges.map((conge) => (
              <tr key={conge.id}>
               <td>{formatDate(conge.date_debut)}</td>
              <td>{formatDate(conge.date_fin)}</td>
                <td>{conge.duree}</td>
                <td>{conge.type}</td>
                <td>{conge.statut}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeConge;
