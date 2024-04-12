import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";

const LeaderDeplacement = () => {
  const [deplacements, setDeplacements] = useState([]);

  // Fonction pour récupérer toutes les demandes de déplacement
  const fetchDeplacements = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/leader/deplacements"
      );
      setDeplacements(response.data); // Assurez-vous que la structure de données est correcte ici
    } catch (error) {
      console.error("Error fetching deplacements:", error);
    }
  };

  // Fonction pour mettre à jour le statut d'une demande de déplacement
  const updateStatus = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:3000/leader/deplacements/${id}`, {
        status: newStatus,
      });
      // Mettre à jour localement le statut de la demande de déplacement
      setDeplacements((prevDeplacements) =>
        prevDeplacements.map((deplacement) =>
          deplacement.id === id
            ? { ...deplacement, status: newStatus }
            : deplacement
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // Charger les demandes de déplacement au chargement du composant
  useEffect(() => {
    fetchDeplacements();
  }, []);

  // Fonction pour formater une date au format yyyy-MM-dd
  const formatDate = (dateString) => {
    return format(new Date(dateString), "yyyy-MM-dd");
  };

  return (
    <div className="container">
      <h2>Leader Deplacements</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Departure Date</th>
            <th>Return Date</th>
            <th>Destination</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {deplacements &&
            deplacements.map((deplacement) => (
              <tr key={deplacement.id}>
                <td>{deplacement.employeeName}</td>
                <td>{formatDate(deplacement.departure_date)}</td>
                <td>{formatDate(deplacement.return_date)}</td>
                <td>{deplacement.destination}</td>
                <td>{deplacement.reason}</td>
                <td>{deplacement.status}</td>
                <td>
                  <button
                    className="btn btn-success"
                    onClick={() => updateStatus(deplacement.id, "Validated")}
                  >
                    Validate
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() =>
                      updateStatus(deplacement.id, "Not Validated")
                    }
                  >
                    Not Validate
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaderDeplacement;
