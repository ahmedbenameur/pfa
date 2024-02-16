import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import Chart from "chart.js/auto";

const EmployeeSortie = () => {
  const { id } = useParams();
  const [sorties, setSorties] = useState([]);
  const [totalSortieHours, setTotalSortieHours] = useState(10);

  const fetchSorties = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/employee/sorties/${id}`
      );
      setSorties(response.data.sorties || []);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des sorties de l'employé :",
        error
      );
    }
  };

  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  useEffect(() => {
    const workHoursChart = new Chart(
      document.getElementById("workHoursChart"),
      {
        type: "doughnut",
        data: {
          labels: ["Sortie Hours"],
          datasets: [
            {
              data: [totalSortieHours],
              backgroundColor: ["#FFCE56"],
              hoverBackgroundColor: ["#FFCE56"],
            },
          ],
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
      }
    );

    return () => {
      workHoursChart.destroy();
    };
  }, [totalSortieHours]);

  useEffect(() => {
    fetchSorties();
  }, [id]);

  return (
    <div className="container mt-5 employee-sortie-container">
      <h2 className="mb-4 text-primary">Total Outing Hours</h2>
      <div className="row">
        <div className="col-md-6">
          <div className="chart-container">
            <canvas id="workHoursChart" width="150" height="150"></canvas>
          </div>
        </div>
   
      </div>
      <div className="col-md-6">
          <Link
            to={`/employeedashboard/${id}/employee_demande_sortie`}
            className="btn btn-success"
          >
            Request Exit
          </Link>
        </div>
      <div className="sorties-table">
        <h3 style={{ marginTop: "20px" }}>Employee Exits</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Description</th>
              <th>Status</th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody>
            {sorties.map((sortie) => (
              <tr key={sortie.id}>
                <td>{formatDate(sortie.date)}</td>
                <td>{sortie.heure_debut}</td>
                <td>{sortie.heure_fin}</td>
                <td>{sortie.description}</td>
                <td>{sortie.status}</td>
                <td>
                  {sortie.duree !== null
                    ? sortie.duree === 0
                      ? "0"
                      : `${sortie.duree} hours`
                    : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeSortie;
