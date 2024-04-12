import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AbsencePresenceVisualization.css';

const AbsencePresenceVisualization = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [employeeNames, setEmployeeNames] = useState([]);
  const [months, setMonths] = useState([]);

  useEffect(() => {
    fetchEmployeeNames();
    fetchMonths();
  }, []);

  const fetchEmployeeNames = async () => {
    try {
      const response = await axios.get('http://localhost:3000/manager/employeeNames');
      setEmployeeNames(response.data);
    } catch (error) {
      console.error('Error fetching employee names:', error);
    }
  };

  const fetchMonths = async () => {
    try {
      const response = await axios.get('http://localhost:3000/manager/months');
      setMonths(response.data);
    } catch (error) {
      console.error('Error fetching months:', error);
    }
  };

  const fetchData = async () => {
    try {
      console.log('Fetching absence data...');
      const absencesResponse = await axios.get('http://localhost:3000/manager/absences', {
        params: {
          month: selectedMonth,
          employeeName: selectedEmployee
        }
      });
      console.log('Absences data:', absencesResponse.data);
      
      console.log('Fetching presence data...');
      const presencesResponse = await axios.get('http://localhost:3000/manager/presences', {
        params: {
          month: selectedMonth,
          employeeName: selectedEmployee
        }
      });
      console.log('Presences data:', presencesResponse.data);

      const combinedData = combineData(absencesResponse.data, presencesResponse.data);
      console.log('Combined data:', combinedData);
      
      setAttendanceData(combinedData);
    } catch (error) {
      console.error('Error fetching attendance data:', error);
    }
  };

  const combineData = (absences, presences) => {
    const combinedData = [];
  
    absences.forEach(absence => {
      const { employeeName, date, endDate } = absence;
      const dates = getDatesArray(date, endDate);
      dates.forEach(date => {
        combinedData.push({ employeeName, date, status: 'Absent' });
      });
    });
  
    presences.forEach(presence => {
      const { employeeName, date } = presence;
      const formattedDate = new Date(date).toISOString().split('T')[0]; // Formatage de la date en "AAAA-MM-JJ"
      combinedData.push({ employeeName, date: formattedDate, status: 'Present' });
    });
  
    // Trier les données par date dans l'ordre croissant
    combinedData.sort((a, b) => new Date(a.date) - new Date(b.date));
  
    return combinedData;
  };
  
  
  const getDatesArray = (startDate, endDate) => {
    const dates = [];
    const currentDate = new Date(startDate);
    const lastDate = new Date(endDate);
    while (currentDate <= lastDate) {
      dates.push(currentDate.toISOString().split('T')[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  };

  const handleEmployeeChange = e => {
    setSelectedEmployee(e.target.value);
  };

  const handleMonthChange = e => {
    setSelectedMonth(e.target.value);
  };

  useEffect(() => {
    if (selectedEmployee && selectedMonth) {
      fetchData();
    }
  }, [selectedEmployee, selectedMonth]);

  const renderTable = () => {
    if (!selectedEmployee || !selectedMonth) return null;
    const filteredData = attendanceData.filter(entry => {
      const employeeMatch = entry.employeeName === selectedEmployee;
      const monthMatch = entry.date.includes(selectedMonth);
      return employeeMatch && monthMatch;
    });
    return (
      <table>
        <thead>
          <tr>
            <th>Employee Name</th>
            {filteredData.map((entry, index) => (
              <th key={index}>{entry.date}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Status</td>
            {filteredData.map((entry, index) => (
              <td key={index} className="status-cell">
                {entry.status === 'Absent' ? 
                  <span className="absent-dot"></span> : 
                  <span className="present-dot"></span>}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    );
  };
  
  
  return (
    <div className="absence-presence-container">
      <h2 className="title">Absence and Presence Visualization</h2>
      <div className="select-container">
        <select value={selectedEmployee} onChange={handleEmployeeChange}>
          <option value="">Select Employee</option>
          {employeeNames.map((employee, index) => (
            <option key={index} value={employee.name}>{employee.name}</option>
          ))}
        </select>
        <select value={selectedMonth} onChange={handleMonthChange}>
          <option value="">Select Month</option>
          {months.map((month, index) => (
            <option key={index} value={month.month}>{month.month}</option>
          ))}
        </select>
      </div>
      <div className="table-container">
        {renderTable()}
      </div>
    </div>
  );
};

export default AbsencePresenceVisualization;
