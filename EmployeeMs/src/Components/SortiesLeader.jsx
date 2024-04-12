import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./style.css"; // Importez le fichier CSS spécifique à ce composant

const SortiesLeader = () => {
  const [sorties, setSorties] = useState([]);

  useEffect(() => {
    const fetchSorties = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/leader/sorties`
        );
        setSorties(response.data.Result);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des sorties du leader :",
          error
        );
      }
    };

    fetchSorties();
  }, []);

  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  return (
    <div className="container mt-5 sorties-leader-container">
      <h2>Employee Exits</h2>
   
      <div className="table-responsive">
        <table className="table table-hover">
          <thead className="table-dark">
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Employee name </th>
              <th scope="col">Date</th>
              <th scope="col">Start Time</th>
              <th scope="col">End Time</th>
              <th scope="col">Duration (in hours)</th>
              <th scope="col">Description</th>
              <th scope="col">Status</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(sorties) && sorties.length > 0 ? (
              sorties.map((sortie) => (
                <tr key={sortie.id}>
                  <td>{sortie.id}</td>
                  <td>{sortie.employee_name}</td>
                  <td>{formatDate(sortie.date)}</td>
                  <td>{sortie.heure_debut}</td>
                  <td>{sortie.heure_fin}</td>
                  <td>{sortie.duree}</td>
                  <td>{sortie.description}</td>
                  <td>{sortie.status}</td>
                  <td>
                    <Link
                      to={`editleadersortie/${sortie.id}`}
                      className="btn btn-primary"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">Aucune sortie disponible</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SortiesLeader;
