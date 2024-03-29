import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Project = () => {
  const [projects, setProjectName] = useState();
  const navigate = useNavigate(); // Déplacez useNavigate ici

  const handleSubmit = (e) => {
    e.preventDefault();
  

    axios.post('http://localhost:3000/leader/projects', {projects})
    .then(result => {
        if (result.data.Status) {
            navigate('/leaderdashboard/projectList'); // Maintenant, cela fonctionnera correctement
        } else {
            alert(result.data.Error)
        }
    })
   .catch(err=> console.log(err))
  }

  return (
    <div className="container mt-5">
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="projectName" className="form-label">Project Name</label>
          <input
            type="text"
            className="form-control"
            id="projectName"
            placeholder="Enter project name"
            onChange={(e) => setProjectName(e.target.value)}
          />
        </div>
        
        <button type="submit" className="btn btn-primary">Add Project</button>
      </form>
    </div>
  );
}

export default Project;

