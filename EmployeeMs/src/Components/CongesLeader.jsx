import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './style.css'; // Assurez-vous que le chemin d'accès est correct

const CongesLeader = ({ leaderId }) => {
  const [conges, setConges] = useState([]);

  useEffect(() => {
    const fetchConges = async () => {
      try {
        // Assurez-vous que cette URL est correcte et que l'endpoint renvoie les noms des employés
        const response = await axios.get(`http://localhost:3000/leader/conges`);
        setConges(response.data.Result);
      } catch (error) {
        console.error("Erreur lors de la récupération des congés du leader :", error);
      }
    };

    fetchConges();
  }, [leaderId]);

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="container mt-5 conges-leader-container">
      <h2>Leaves of Employee</h2>
      <Link to={`leaves-calendar`} className="btn btn-primary">View Calendar</Link>
      <div className="table-responsive">
        <table className="table table-hover">
          <thead className="table-dark">
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Employee Name</th> {/* Mis à jour pour la clarté */}
              <th scope="col">Start Date</th>
              <th scope="col">End Date</th>
              <th scope="col">Status</th>
              <th scope="col">Created At</th>
              <th scope="col">Duration</th>
              <th scope="col">Type</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(conges) && conges.length > 0 ? (
              conges.map((conge) => (
                <tr key={conge.id}>
                  <td>{conge.id}</td>
                  <td>{conge.employee_name}</td> {/* Utilisation de employee_name */}
                  <td>{formatDate(conge.date_debut)}</td>
                  <td>{formatDate(conge.date_fin)}</td>
                  <td>{conge.statut}</td>
                  <td>{formatDate(conge.created_at)}</td>
                  <td>{conge.duree}</td>
                  <td>{conge.type}</td>
                  <td>
                    <Link to={`editleaderconge/${conge.id}`} className="btn btn-primary">Edit</Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9">No Leaves Found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CongesLeader;
