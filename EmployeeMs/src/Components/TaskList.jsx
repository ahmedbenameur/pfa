import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const TaskList = () => {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3000/leader/tasks')
            .then(response => {
                if (response.data.Status) {
                    setTasks(response.data.Result);
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
                // Recharger les tâches ou retirer la tâche supprimée de l'état pour mettre à jour l'interface utilisateur
                window.location.reload(false); // Une approche simple mais non optimale pour actualiser les tâches
            })
            .catch(error => console.error('There was an error!', error));
    };

    return (
        <div className="container mt-5">
            <h2>Tasks List</h2>
            <Link to="add_task" className="btn btn-success mb-3">Add Task</Link>
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
                        {tasks.map((task, index) => (
                            <tr key={task.id}>
                                <th scope="row">{index + 1}</th>
                                <td>{task.name}</td>
                                <td>{task.status}</td>
                                <td>Projet: {task.projectID}</td> {/* Assurez-vous de remplacer projectID par le nom du projet si disponible */}
                                <td>Assigné à: {task.employeeID}</td> 
                                  <td>
                        <button 
                            className="btn btn-danger" 
                            onClick={() => deleteTask(task.id)}>
                            Delete
                        </button>
                    </td>{/* Assurez-vous de remplacer employeeID par le nom de l'employé si disponible */}
                            </tr>
                            
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TaskList;
