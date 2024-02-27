import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './style.css'; // Importez le fichier de styles CSS

const EditLeaderConge = () => {
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCongeStatus = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/leader/conges/${id}`);
        setStatus(response.data.Result.status);
      } catch (error) {
        console.error('Erreur lors de la récupération du statut du congé:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCongeStatus();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    try {
      await axios.put(`http://localhost:3000/leader/update_conge_status/${id}`, { status: newStatus });
      setStatus(newStatus);
      // Rediriger vers la page CongesLeader après avoir accepté ou refusé
      navigate('../conges');
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut du congé:', error);
    }
  };

  return (
    <div className="edit-leader-conge-container">
      <h2>Edit Leader Conge</h2>
      <p>Conge ID: {id}</p>
      {isLoading ? (
        <p>Chargement en cours...</p>
      ) : (
        <>
          <p className={`status-label ${status.toLowerCase()}`}>Current Status: {status}</p>
          <div className="button-container">
            <button className="accept-button" onClick={() => handleStatusChange('accepted')}>
              Accept
            </button>
            <button className="refuse-button" onClick={() => handleStatusChange('refused')}>
              Refuse
            </button>
          </div>
          <Link to="../conges" className="back-link">
            Retour à la page CongesLeader
          </Link>
        </>
      )}
    </div>
  );
};

export default EditLeaderConge;
