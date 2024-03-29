import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Productivity = () => {
  const [dataForChart, setDataForChart] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tasksRes, employeesRes] = await Promise.all([
          axios.get('http://localhost:3000/leader/tasks'),
          axios.get('http://localhost:3000/auth/employee'),
        ]);

        if (tasksRes.data.Status && employeesRes.data.Status) {
          // Create a mapping from employeeID to employeeName
          const employees = employeesRes.data.Result.reduce((acc, employee) => {
            acc[employee.id] = employee.name; // Map employeeID to employeeName
            return acc;
          }, {});

          // Add employeeName to each task
          const tasksWithEmployeeName = tasksRes.data.Result.map(task => ({
            ...task,
            employeeName: employees[task.employeeID] || 'Unknown', // Add employeeName to task
          }));

          // Aggregate tasks by employee and by status
          const tasksByEmployeeAndStatus = tasksWithEmployeeName.reduce((acc, { employeeID, employeeName, status }) => {
            const key = `${employeeID}-${employeeName}`; // Unique key per employee
            acc[key] = acc[key] || { name: employeeName, "Pending": 0, "In Progress": 0, "Completed": 0 };
            acc[key][status] += 1;
            return acc;
          }, {});

          setDataForChart(Object.values(tasksByEmployeeAndStatus));
        } else {
          alert("Failed to fetch tasks or employees");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={dataForChart}
        margin={{
          top: 20, right: 30, left: 20, bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="Pending" stackId="a" fill="#8884d8" />
        <Bar dataKey="In Progress" stackId="a" fill="#82ca9d" />
        <Bar dataKey="Completed" stackId="a" fill="#ffc658" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default Productivity;
