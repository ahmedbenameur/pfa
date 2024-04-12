import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

const EmployeeDeplacement = () => {
  const { id } = useParams();
  const [deplacements, setDeplacements] = useState([]);

  const fetchDeplacements = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/employee/deplacements/${id}`
      );
      const deplacementsData = Array.isArray(response.data.conges)
        ? response.data.conges.map((deplacement) => ({
            ...deplacement,
            departure_Date: new Date(
              deplacement.departure_date
            ).toLocaleDateString("en-US"),
            return_Date: new Date(deplacement.return_date).toLocaleDateString(
              "en-US"
            ),
          }))
        : [];
      setDeplacements(deplacementsData);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des déplacements de l'employé :",
        error
      );
    }
  };

  useEffect(() => {
    fetchDeplacements();
  }, [id]);

  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  return (
    <div className="container mt-5 employee-deplacement-container">
      <h2 className="mb-4 text-primary">Employee Trips</h2>
      <Link
        to={`/employeedashboard/${id}/employee_demande_deplacement`}
        className="btn btn-success"
      >
        Trip Request
      </Link>

      {/* Tableau des déplacements */}
      <div className="deplacements-table">
        <h3 style={{ marginTop: "20px" }}>Employee Trips</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Departure Date</th>
              <th>Return Date</th>
              <th>Destination</th>
              <th>Reason</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {deplacements.map((deplacement) => (
              <tr key={deplacement.id}>
                <td>{formatDate(deplacement.departure_Date)}</td>
                <td>{formatDate(deplacement.return_Date)}</td>

                <td>{deplacement.destination}</td>
                <td>{deplacement.reason}</td>
                <td>{deplacement.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeDeplacement;
