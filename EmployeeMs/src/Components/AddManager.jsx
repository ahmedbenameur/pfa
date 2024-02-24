// AddManager.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddManager = () => {
  const [manager, setManager] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Send the manager data as JSON
    axios.post('http://localhost:3000/auth/add_manager', manager, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      if(response.data.Status) {
        navigate('/dashboard/manager');
      } else {
        alert(response.data.Error);
      }
    })
    .catch(error => {
      console.error("Error adding manager:", error);
    });
  };

  return (
    <div className="d-flex justify-content-center align-items-center mt-3">
      <div className="p-3 rounded w-50 border">
        <h3 className="text-center">Add Manager</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="inputName" className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              id="inputName"
              placeholder="Enter Name"
              value={manager.name}
              onChange={(e) => setManager({ ...manager, name: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="inputEmail" className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              id="inputEmail"
              placeholder="Enter Email"
              value={manager.email}
              onChange={(e) => setManager({ ...manager, email: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="inputPassword" className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              id="inputPassword"
              placeholder="Enter Password"
              value={manager.password}
              onChange={(e) => setManager({ ...manager, password: e.target.value })}
            />
          </div>
          <button type="submit" className="btn btn-primary">Add Manager</button>
        </form>
      </div>
    </div>
  );
};

export default AddManager;
