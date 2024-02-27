import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './style.css'; // Importez le fichier de styles CSS

const EditLeaderSortie = () => {
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSortieStatus = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/leader/sorties/${id}`);
        // Assurez-vous que le statut est correctement extrait de la réponse
        setStatus(response.data.Result.status);
      } catch (error) {
        console.error('Erreur lors de la récupération du statut de la sortie:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSortieStatus();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    try {
      await axios.put(`http://localhost:3000/leader/update_sortie_status/${id}`, { status: newStatus });
      setStatus(newStatus);
      // Rediriger vers la page ExitLeader après avoir accepté ou refusé
      navigate('../sorties');
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut de la sortie:', error);
    }
  };

  return (
    <div className="edit-leader-conge-container">
      <h2>Edit Leader Exit</h2>
      <p>Exit ID: {id}</p>
      {isLoading ? (
        <p>Chargement en cours...</p>
      ) : (
        <>
          <p className={`status-label ${status && status.toLowerCase()}`}>Current Status: {status}</p>
          <div className="button-container">
            <button className="accept-button" onClick={() => handleStatusChange('accepted')}>
              Accept
            </button>
            <button className="refuse-button" onClick={() => handleStatusChange('refused')}>
              Refuse
            </button>
          </div>
          <Link to="../sorties" className="back-link">
            Retour à la page ExitLeader
          </Link>
        </>
      )}
    </div>
  );
};

export default EditLeaderSortie;
