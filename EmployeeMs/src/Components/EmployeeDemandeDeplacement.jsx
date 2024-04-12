import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
const EmployeeDemandeDeplacement = () => {
  // États pour les champs du formulaire
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [destination, setDestination] = useState("Tunisie"); // Valeur par défaut
  const [reason, setReason] = useState("");
  const { id } = useParams();

  // Fonction pour soumettre le formulaire
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Envoyer les données du formulaire au backend
      const response = await axios.post(
        "http://localhost:3000/employee/deplacements",
        {
          employeeId: id,
          departureDate,
          returnDate,
          destination,
          reason,
        }
      );

      console.log("Réponse du serveur :", response.data);
      // Réinitialiser les champs après la soumission du formulaire
      setDepartureDate("");
      setReturnDate("");
      setDestination("Tunisie"); // Réinitialisation à la valeur par défaut
      setReason("");
      alert("Demande de déplacement soumise avec succès!");
    } catch (error) {
      console.error("Erreur lors de la soumission du formulaire :", error);
      alert(
        "Une erreur s'est produite lors de la soumission de la demande de déplacement. Veuillez réessayer."
      );
    }
  };

  return (
    <div className="container">
      <h2>Demande de Déplacement</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="departureDate" className="form-label">
            Date de Départ :
          </label>
          <input
            type="date"
            className="form-control"
            id="departureDate"
            value={departureDate}
            onChange={(e) => setDepartureDate(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="returnDate" className="form-label">
            Date de Retour :
          </label>
          <input
            type="date"
            className="form-control"
            id="returnDate"
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="destination" className="form-label">
            Destination :
          </label>
          <select
            className="form-select"
            id="destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            required
          >
            <option value="Tunisie">Tunisie</option>
            <option value="Etranger">Etranger</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="reason" className="form-label">
            Raison du Déplacement :
          </label>
          <textarea
            className="form-control"
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Soumettre
        </button>
      </form>
    </div>
  );
};

export default EmployeeDemandeDeplacement;
