// AddManager.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddLeader = () => {
  const [leader, setLeader] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Send the manager data as JSON
    axios.post('http://localhost:3000/leader/add_leader', leader, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      if(response.data.Status) {
        navigate('/dashboard/leader');
      } else {
        alert(response.data.Error);
      }
    })
    .catch(error => {
      console.error("Error adding Leader:", error);
    });
  };

  return (
    <div className="d-flex justify-content-center align-items-center mt-3">
      <div className="p-3 rounded w-50 border">
        <h3 className="text-center">Add Leader</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="inputName" className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              id="inputName"
              placeholder="Enter Name"
              value={leader.name}
              onChange={(e) => setLeader({ ...leader, name: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="inputEmail" className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              id="inputEmail"
              placeholder="Enter Email"
              value={leader.email}
              onChange={(e) => setLeader({ ...manager, email: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="inputPassword" className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              id="inputPassword"
              placeholder="Enter Password"
              value={leader.password}
              onChange={(e) => setLeader({ ...manager, password: e.target.value })}
            />
          </div>
          <button type="submit" className="btn btn-primary">Add Leader</button>
        </form>
      </div>
    </div>
  );
};

export default AddLeader;
