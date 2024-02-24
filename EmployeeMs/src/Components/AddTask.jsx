import React, { useState, useEffect } from 'react';
import './AddTask.css'; 
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddTask = () => {
    const [projects, setProjects] = useState([]);
    const navigate = useNavigate()
    const [employees, setEmployees] = useState([]);
    const [task, setTask] = useState({
        name: "",
        status: "",
        projectID: "",
        employeeID: "",
    });

    useEffect(() => {
        const fetchProjectsAndEmployees = async () => {
            try {
                const projectListResponse = await axios.get('http://localhost:3000/leader/projectList');
                const employeeListResponse = await axios.get('http://localhost:3000/leader/employee');
                
                if (projectListResponse.data.Status) {
                    setProjects(projectListResponse.data.Result);
                } else {
                    alert(projectListResponse.data.Error);
                }

                if (employeeListResponse.data.Status) {
                    setEmployees(employeeListResponse.data.Result);
                } else {
                    alert(employeeListResponse.data.Error);
                }
            } catch (err) {
                console.error(err);
            }
        };

        fetchProjectsAndEmployees();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTask((prevTask) => ({
            ...prevTask,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        axios.post('http://localhost:3000/leader/add_task', task)
            .then(response => {
                if(response.data.Status) {
                    navigate('/dashboard/taskList')
                    // Assuming you want to navigate after success
                    // navigate('/dashboard/add_task'); // Uncomment this line if you have navigate defined
                    console.log('Task added successfully');
                    
                } else {
                    alert(response.data.Error);
                }
            })
            .catch(error => {
                console.error('Error adding task:', error);
            });
    };

    return (
        <div className="add-task-container">
            <h2 className="add-task-title">Add task:</h2>
            <form className="add-task-form" onSubmit={handleSubmit}>
                {/* Name field */}
                <input
                    name="name"
                    type="text"
                    className="form-control"
                    placeholder="Nom de la nouvelle tâche"
                    required
                    value={task.name}
                    onChange={handleChange}
                />
                {/* Project select */}
                <select className="form-control" name="projectID" value={task.projectID} onChange={handleChange}>
                    <option value="">Sélectionner un projet</option>
                    {projects.map(project => (
                        <option key={project.id} value={project.id}>{project.name}</option>
                    ))}
                </select>
                {/* Employee select */}
                <select className="form-control" name="employeeID" value={task.employeeID} onChange={handleChange}>
                    <option value="">Sélectionner un employé</option>
                    {employees.map(employee => (
                        <option key={employee.id} value={employee.id}>{employee.name}</option>
                    ))}
                </select>
                {/* Status select */}
                <select className="form-control" name="status" value={task.status} onChange={handleChange}>
                    <option value="">Définir le statut</option>
                    <option value="En attente">En attente</option>
                    <option value="En cours">En cours</option>
                    <option value="Terminé">Terminé</option>
                </select>
                <button type="submit" className="btn btn-primary">Ajouter la tâche</button>
            </form>
        </div>
    );
};

export default AddTask;
