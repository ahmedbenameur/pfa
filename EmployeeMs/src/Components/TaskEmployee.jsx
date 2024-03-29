import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'; // Importez useParams
import './TaskEmployee.css';

const TaskEmployee = () => {
  const [tasks, setTasks] = useState([]);
  const { employeeID } = useParams(); // Utilisez useParams pour extraire l'ID de l'employé

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/employee/tasks/${employeeID}`);
        setTasks(res.data.Result || []);
      } catch (error) {
        console.error("Error fetching employee tasks:", error);
      }
    };

    fetchTasks();
  }, [employeeID]); // Ajoutez employeeID comme dépendance pour recharger les tâches si l'ID change

  const handleStatusChange = (taskId, newStatus) => {
    setTasks(tasks.map(task => task.id === taskId ? { ...task, status: newStatus } : task));
  };

  const saveTaskStatus = async (taskId) => {
    const task = tasks.find(task => task.id === taskId);
    if (!task) return;

    try {
      await axios.put(`http://localhost:3000/employee/tasks/${taskId}/status`, { status: task.status });
      console.log("Status updated successfully");
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  return (
    <div>
      <h2>My Tasks</h2>
      <ul className="taskList">
        {tasks.map(task => (
          <li key={task.id} className={`taskItem ${task.status.replace(/\s+/g, '').toLowerCase()}`}>
            <span className="taskName">{task.name} - Status: {task.status}</span>
            <select
              className="statusSelect"
              value={task.status}
              onChange={(e) => handleStatusChange(task.id, e.target.value)}
            >
              <option value="Pending">Pending</option>
              <option value="In progress">In progress</option>
              <option value="Completed">Completed</option>
            </select>
            <button onClick={() => saveTaskStatus(task.id)}>Save</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskEmployee;
