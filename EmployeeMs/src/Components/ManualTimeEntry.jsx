import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const ManualTimeEntry = () => {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [date, setDate] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const start = new Date(`2000-01-01T${startTime}`);
      const end = new Date(`2000-01-01T${endTime}`);
      const durationMs = end - start - 2 * 60 * 60 * 1000;
      const durationHours = durationMs / (1000 * 60 * 60);

      const existingEntryResponse = await axios.get(`http://localhost:3000/employee/timeentry/${id}?date=${date}`);
      if (existingEntryResponse.data.Status && existingEntryResponse.data.Result.length > 0) {
        console.log("Entry already exists for this date and employee.");
        return;
      }

      const insertionResponse = await axios.post(`http://localhost:3000/employee/manual-time-entry`, {
        employee_id: id,
        start_time: startTime,
        end_time: endTime,
        date: date,
        hours_worked: durationHours,
      });

      console.log("Response from backend:", insertionResponse.data);

      navigate(`/employeedashboard/${id}/WorkTimeTracking`);
    } catch (error) {
      console.error("Error inserting manual time entry:", error);
    }
  };

  return (
    <div>
      <h2>Manual Time Entry</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="startTime">Start Time:</label>
          <input
            type="time"
            id="startTime"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="endTime">End Time:</label>
          <input
            type="time"
            id="endTime"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="date">Date:</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ManualTimeEntry;
