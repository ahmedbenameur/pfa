import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar } from '@fortawesome/free-solid-svg-icons';

const TaskList = () => {
    const [task, setTask] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3000/leader/tasks')
            .then(response => {
                if (response.data.Status) {
                    setTask(response.data.Result);
                } else {
                    alert('Failed to fetch tasks');
                }
            })
            .catch(error => console.error('There was an error!', error));
    }, []);

    const deleteTask = (id) => {
        axios.delete(`http://localhost:3000/leader/delete_task/${id}`)
            .then(response => {
                console.log(response.data);
                window.location.reload(false);
            })
            .catch(error => console.error('There was an error!', error));
    };

    return (
        <div className="container mt-5">
            <h2>Tasks List</h2>
            <div className="d-flex justify-content-between mb-3">
                <Link to='/leaderdashboard/add_task' className="btn btn-success">Add Task</Link>
               
            </div>
            <div className="d-flex justify-content-center mb-3">
                {/* Utiliser FontAwesomeIcon pour l'icône de statistiques */}
                <Link to='/leaderdashboard/task_visualisation' className="btn btn-primary">
                    <FontAwesomeIcon icon={faChartBar} /> Tasks Visualization
                </Link>
            </div>
            <div className="table-responsive">
                <table className="table table-hover">
                    <thead className="table-dark">
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Task Name</th>
                            <th scope="col">Status</th>
                            <th scope="col">Project</th>
                            <th scope="col">Assigned To</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {task.map((task, index) => (
                            <tr key={task.id}>
                                <th scope="row">{index + 1}</th>
                                <td>{task.name}</td>
                                <td>{task.status}</td>
                                <td>Projet: {task.projectID}</td> {/* Remplacez projectID par le nom du projet si disponible */}
                                <td>Assigné à: {task.employeeID}</td> {/* Remplacez employeeID par le nom de l'employé si disponible */}
                                <td>
                                    <button 
                                        className="btn btn-danger" 
                                        onClick={() => deleteTask(task.id)}>
                                        Delete
                                    </button>
                                </td>
                            </tr>  
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TaskList;
