import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const styles = {
    container: {
        padding: '20px',
        maxWidth: '800px',
        margin: '20px auto',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        borderRadius: '8px',
        backgroundColor: '#ffffff',
    },
    selectInput: {
        padding: '10px',
        margin: '10px 0',
        display: 'block',
        width: 'calc(100% - 20px)',
        fontSize: '16px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        boxSizing: 'border-box',
        transition: 'border-color 0.3s',
    },
    button: {
        padding: '10px 20px',
        margin: '20px 0',
        backgroundColor: '#0056b3',
        color: '#ffffff',
        border: 'none',
        cursor: 'pointer',
        fontSize: '16px',
        borderRadius: '4px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        transition: 'background-color 0.3s',
    },
    errorMessage: {
        color: '#d32f2f',
        marginTop: '10px',
    },
    infoMessage: {
        color: '#2e7d32',
        marginTop: '10px',
    },
    chartContainer: {
        marginTop: '30px',
        padding: '20px',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px',
        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)',
    }
};

// Ajoutez cette partie au début de votre composant pour gérer l'effet de focus sur les input et les boutons
// Vous pouvez l'ajouter directement dans le composant WorkedHours, par exemple juste avant le return.
const handleFocus = (e) => {
    e.target.style.borderColor = '#007bff';
};

const handleBlur = (e) => {
    e.target.style.borderColor = '#ccc';
};

// Assurez-vous d'ajouter onFocus={handleFocus} et onBlur={handleBlur} à vos éléments input et select.


const WorkedHours = () => {
    const [employeeId, setEmployeeId] = useState('');
    const [date, setDate] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [workedHoursInfo, setWorkedHoursInfo] = useState(null);
    const [monthlyWorkedHoursInfo, setMonthlyWorkedHoursInfo] = useState(null);
    const [employees, setEmployees] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const response = await axios.get('http://localhost:3000/manager/employees');
            setEmployees(response.data.employees);
        } catch (err) {
            console.error('Failed to fetch employees:', err);
        }
    };

    const fetchWorkedHours = async () => {
        try {
            const response = await axios.get('http://localhost:3000/manager/worked-hours', {
                params: { employeeId, date }
            });
            setWorkedHoursInfo(response.data);
            setError('');
        } catch (err) {
            setError('Failed to fetch worked hours. Please try again.');
            console.error(err);
        }
    };

    const fetchMonthlyWorkedHours = async () => {
        if (!employeeId) {
            setError('Please select an employee.');
            return;
        }

        if (!year || !month) {
            setError('Please select both year and month.');
            return;
        }

        try {
            const response = await axios.get('http://localhost:3000/manager/monthly-worked-hours', {
                params: { employeeId, year, month }
            });
            setMonthlyWorkedHoursInfo(response.data);
            setError('');
        } catch (err) {
            setError('Failed to fetch monthly worked hours. Please try again.');
            console.error(err);
        }
    };

    return (
        <div style={styles.container}>
            <h2>Check Worked Hours</h2>
            <div>
                <label>Select an Employee:</label>
                <select 
                    style={styles.selectInput}
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                >
                    <option value="">Select an employee</option>
                    {employees.map((employee) => (
                        <option key={employee.id} value={employee.id}>{employee.name}</option>
                    ))}
                </select>
            </div>
            <div>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    style={styles.selectInput}
                />
                <button onClick={fetchWorkedHours} style={styles.button}>Check Daily Hours</button>
            </div>
            <div>
                <label>Select Year:</label>
                <select
                    style={styles.selectInput}
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                >
                    <option value="">Select a year</option>
                    {[...Array(new Date().getFullYear() - 2019).keys()].map(y => {
                        const yearValue = 2020 + y;
                        return <option key={yearValue} value={yearValue}>{yearValue}</option>;
                    })}
                </select>
            </div>
            <div>
                <label>Select Month:</label>
                <select
                    style={styles.selectInput}
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                >
                    <option value="">Select a month</option>
                    {Array.from({ length: 12 }, (_, i) => ({
                        label: new Date(0, i).toLocaleString('en', { month: 'long' }),
                        value: i + 1,
                    })).map(m => (
                        <option key={m.value} value={m.value}>{m.label}</option>
                    ))}
                </select>
            </div>
            <button onClick={fetchMonthlyWorkedHours} style={styles.button}>Check Monthly Hours</button>

            {error && <p style={styles.errorMessage}>{error}</p>}

            {workedHoursInfo && (
                <div>
                    <p>Hours Worked: {workedHoursInfo.totalWorkedHours}</p>
                    <p>Completed 8 Hours? {workedHoursInfo.completed8Hours ? 'Yes' : 'No'}</p>
                </div>
            )}
            {monthlyWorkedHoursInfo && (
                <div style={styles.chartContainer}>
                    <p>Monthly Hours Worked: {monthlyWorkedHoursInfo.totalWorkedHours}</p>
                    <Bar
                        data={{
                            labels: ['Monthly Hours'],
                            datasets: [{
                                label: 'Hours Worked',
                                data: [monthlyWorkedHoursInfo.totalWorkedHours],
                                backgroundColor: [
                                    'rgba(54, 162, 235, 0.2)',
                                ],
                                borderColor: [
                                    'rgba(54, 162, 235, 1)',
                                ],
                                borderWidth: 1
                            }]
                        }}
                        options={{
                            scales: {
                                y: {
                                    beginAtZero: true
                                }
                            }
                        }}
                    />
                    <p style={styles.infoMessage}>The required total hours worked in a month should be 140 hours.</p>
                </div>
            )}
        </div>
    );
};

export default WorkedHours;
