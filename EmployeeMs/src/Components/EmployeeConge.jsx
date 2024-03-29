import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const EmployeeConge = () => {
  const { id } = useParams();
  const [conges, setConges] = useState([]);
  const [soldeConges, setSoldeConges] = useState({ soldeMaladie: 24, soldeAnnuelle: 24 }); // Initialisé avec les valeurs par défaut

  const fetchConges = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/employee/conges/${id}`);
      setConges(response.data.conges || []);
    } catch (error) {
      console.error('Error fetching employee leaves:', error);
    }
  };

  const fetchSoldeConges = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/employee/employee-conge-solde/${id}`);
      const { soldeMaladie, soldeAnnuelle } = response.data.data;
      setSoldeConges({ soldeMaladie, soldeAnnuelle }); // Ajusté selon les nouvelles clés
    } catch (error) {
      console.error('Error fetching leave balance:', error);
    }
  };

  useEffect(() => {
    fetchConges();
    fetchSoldeConges();
  }, [id]);

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Data for chart, adjusted for new state keys
  const leaveData = {
    labels: ['Sick Leave', 'Annual Leave'],
    datasets: [
      {
        label: 'Remaining Days',
        data: [soldeConges.soldeMaladie, soldeConges.soldeAnnuelle],
        backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)'],
        borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="container mt-5 employee-conge-container">
      <h2 className="mb-4 text-primary">Accrued Leaves</h2>

      {/* Display leave balances and chart */}
      <div className="row">
        <div className="col-md-6">
          <h4>Sick Leave</h4>
          <p>Remaining days: {soldeConges.soldeMaladie}</p>
          <h4>Annual Leave</h4>
          <p>Remaining days: {soldeConges.soldeAnnuelle}</p>
        </div>
        <div className="col-md-6">
          <Bar data={leaveData} />
        </div>
      </div>

      <Link to={`/employeedashboard/${id}/employee_demande_conge`} className='btn btn-success'>
        Request Leave
      </Link>

      {/* Leaves table */}
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
