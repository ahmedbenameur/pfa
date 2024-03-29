import React, { useState, useEffect } from 'react';
import './AddTask.css'; 
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddTask = () => {
    const [projects, setProjects] = useState([]);
    const navigate = useNavigate();
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
                const employeeListResponse = await axios.get('http://localhost:3000/auth/employee');
                
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
                    navigate('/leaderdashboard/taskList');
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
            <h2 className="add-task-title">Add Task:</h2>
            <form className="add-task-form" onSubmit={handleSubmit}>
                {/* Name field */}
                <input
                    name="name"
                    type="text"
                    className="form-control"
                    placeholder="Name of the new task"
                    required
                    value={task.name}
                    onChange={handleChange}
                />
                {/* Project select */}
                <select className="form-control" name="projectID" value={task.projectID} onChange={handleChange}>
                    <option value="">Select a project</option>
                    {projects.map(project => (
                        <option key={project.id} value={project.id}>{project.name}</option>
                    ))}
                </select>
                {/* Employee select */}
                <select className="form-control" name="employeeID" value={task.employeeID} onChange={handleChange}>
                    <option value="">Select an employee</option>
                    {employees.map(employee => (
                        <option key={employee.id} value={employee.id}>{employee.name}</option>
                    ))}
                </select>
                {/* Status select */}
                <select className="form-control" name="status" value={task.status} onChange={handleChange}>
                    <option value="">Set status</option>
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                </select>
                <button type="submit" className="btn btn-primary">Add Task</button>
            </form>
        </div>
    );
};

export default AddTask;
