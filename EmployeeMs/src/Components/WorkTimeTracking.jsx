import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { format } from "date-fns";
import "./WorkTimeTracking.css";

const WorkTimeTracking = () => {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [timeEntries, setTimeEntries] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    fetchTimeEntries();
  }, []);

  const fetchTimeEntries = () => {
    axios
      .get(`http://localhost:3000/employee/time-entries`, {
        params: { employee_id: id },
      })
      .then((response) => {
        setTimeEntries(response.data.Result);
      })
      .catch((error) => {
        console.error("Error fetching time entries:", error);
      });
  };

  const handleClockIn = () => {
    if (startTime) {
      alert("Vous avez déjà effectué le pointage Clock In.");
    } else {
      const currentTime = new Date().toLocaleTimeString();
      axios
        .post("http://localhost:3000/employee/clock-in", { employee_id: id })
        .then((response) => {
          setStartTime(currentTime);
          console.log(response.data);
          fetchTimeEntries();
        })
        .catch((error) => {
          console.error("Error clocking in:", error);
        });
    }
  };

  const handleClockOut = () => {
    if (endTime) {
      alert("Vous avez déjà effectué le pointage Clock Out.");
    }
    const currentTime = new Date().toLocaleTimeString();
    axios
      .post("http://localhost:3000/employee/clock-out", { employee_id: id })
      .then((response) => {
        setEndTime(currentTime);
        console.log(response.data);
        fetchTimeEntries();
        // Après avoir mis à jour l'heure de fin, calculer et mettre à jour les heures travaillées
        axios
          .post("http://localhost:3000/employee/hours-worked")
          .then((calculationResponse) => {
            console.log(calculationResponse.data);
          })
          .catch((calculationError) => {
            console.error(
              "Erreur lors du calcul des heures travaillées:",
              calculationError
            );
          });
      })
      .catch((error) => {
        console.error("Error clocking out:", error);
      });
  };

  // Fonction pour formater l'heure sans date
  const formatTimeWithoutDate = (time) => {
    if (time) {
      // Ajouter une date fictive pour pouvoir formater l'heure
      const dateWithTime = new Date(`2000-01-01T${time}`);
      return format(dateWithTime, "HH:mm:ss");
    }
    return "Not clocked out";
  };

  return (
    <div className="work-time-container">
      <h2 style={{ color: "#007bff", marginBottom: "30px" }}>
        Work Time Tracking
      </h2>
      <div>
        <div>
          <strong>Start Time:</strong> {startTime || "Not clocked in"}
        </div>
        <div>
          <strong>End Time:</strong> {endTime || "Not clocked out"}
        </div>
        <div style={{ marginTop: "20px" }}>
          <button
            onClick={handleClockIn}
            disabled={!!startTime}
            className="button"
          >
            Clock In
          </button>
          <span style={{ marginRight: "10px" }}></span>
          <button
            onClick={handleClockOut}
            disabled={!!endTime}
            className="button1"
          >
            Clock Out
          </button>
        </div>
      </div>
      <div className="table-container">
        {timeEntries.length > 0 && (
          <div>
            <h3>Time Entries:</h3>
            <table>
              <thead>
                <tr>
                  <th>id</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th>Hours Worked</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {timeEntries.map((entry, index) => (
                  <tr key={index}>
                    <td>{entry.id}</td>
                    <td>{formatTimeWithoutDate(entry.start_time)}</td>
                    <td>{formatTimeWithoutDate(entry.end_time)}</td>
                    <td>
                      {entry.hours_worked !== null
                        ? `${entry.hours_worked} hours`
                        : "N/A"}
                    </td>
                    <td>{format(new Date(entry.date), "yyyy-MM-dd")}</td>
                    <td>
                      {entry.end_time === null ? (
                        <Link
                          to={`/employeedashboard/${id}/edit_entry/${entry.id}`}
                          className="button edit-button" // Ajoutez une classe CSS pour le style du bouton
                        >
                          Edit
                        </Link>
                      ) : (
                        " "
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkTimeTracking;
