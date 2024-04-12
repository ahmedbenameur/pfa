import express, { response } from 'express';
import jwt from 'jsonwebtoken';  // Import jwt module
import con from '../utils/db.js';
import bcrypt from 'bcrypt';

const router = express.Router()

router.post("/manager_login", (req, res) => {
    const sql = "SELECT * from manager Where email = ?";
    con.query(sql, [req.body.email], (err, result) => {
        if (err) return res.json({ loginStatus: false, Error: "Query error" });

        // Check if any user is found with the provided email
        if (result.length > 0) {
            // Directly compare the provided password with the one in the database
            if(req.body.password === result[0].password) {
                // Passwords match
                const email = result[0].email;
                const token = jwt.sign(
                    { role: "manager", email: email, id: result[0].id },
                    "jwt_secret_key",
                    { expiresIn: "1d" }
                );
                res.cookie('token', token, { httpOnly: true });
                return res.json({ loginStatus: true, id: result[0].id });
            } else {
                // Passwords do not match
                return res.json({ loginStatus: false, Error: "Wrong email or password" });
            }
        } else {
            // No user found with the provided email
            return res.json({ loginStatus: false, Error: "Wrong email or password" });
        }
    });
});

  

router.get('/logout', (req, res) => {
    res.clearCookie('token')
    return res.json({Status: true})
})
  
  
router.get("/worked-hours", (req, res) => {
    const { employeeId } = req.query; // Utilise l'ID de l'employé pour la requête
    const { date } = req.query; // La date pour laquelle vous voulez vérifier les heures travaillées

    // Supposons que 'hours_worked' soit déjà calculé et stocké dans chaque entrée de la table 'time_entries'
    const sql = `
        SELECT id, employee_id, start_time, end_time, 
               hours_worked, date, status
        FROM time_entries
        WHERE employee_id = ? AND DATE(date) = ?
    `;

    con.query(sql, [employeeId, date], (err, result) => {
        if (err) {
            console.error("Error fetching worked hours:", err);
            return res.status(500).json({ status: false, error: "Internal server error" });
        }

        if (result.length > 0) {
            // Calcule le total des heures travaillées pour la journée
            const totalWorkedHours = result.reduce((acc, curr) => acc + curr.hours_worked, 0);

            // Détermine si l'employé a complété les 8 heures requises
            const completed8Hours = totalWorkedHours >= 8;

            return res.json({ status: true, totalWorkedHours, completed8Hours });
        } else {
            return res.status(404).json({ status: false, error: "No entries found for this employee on the specified date" });
        }
    });
});



router.get("/employees", (req, res) => {
    const sql = "SELECT id, name FROM employee"; // Remplacez 'employee' par le nom réel de votre table d'employés
    con.query(sql, (err, result) => {
        if (err) {
            console.error("Error fetching employees:", err);
            return res.status(500).json({ status: false, error: "Internal server error" });
        }
        return res.json({ employees: result });
    });
});


router.get('/monthly-worked-hours', (req, res) => {
    const { employeeId, year, month } = req.query;

    // Adjusting the end date to ensure it covers all possibilities (e.g., leap years for February)
    const endDate = new Date(year, month, 0).toISOString().slice(0, 10); // This will correctly handle the end date

    const startDate = `${year}-${month.padStart(2, '0')}-01`; // Ensures month is two digits
    const sql = `
        SELECT SUM(hours_worked) AS totalHoursWorked
        FROM time_entries
        WHERE employee_id = ? AND date >= ? AND date < ?
    `; // Note: The end date is exclusive to match the SQL standard practices

    con.query(sql, [employeeId, startDate, endDate], (err, result) => {
        if (err) {
            console.error("Error fetching monthly worked hours:", err);
            return res.status(500).json({ status: false, error: "Internal server error" });
        }
        if (result[0].totalHoursWorked !== null) {
            return res.json({ status: true, totalWorkedHours: result[0].totalHoursWorked });
        } else {
            return res.status(404).json({ status: false, error: "No entries found for this employee in the specified month" });
        }
    });
});
   

// Route pour récupérer les noms distincts des employés
router.get('/employeeNames', (req, res) => {
    const query = `SELECT DISTINCT name FROM employee`;
    con.query(query, (err, employeeNames) => {
        if (err) {
            console.error("Erreur lors de l'exécution de la requête :", err);
            return res.status(500).json({ message: err.message });
        }
        
        return res.json(employeeNames);
    });
});

router.get('/months', (req, res) => {
    const query = `
        SELECT DISTINCT MONTH(date) AS month 
        FROM (
            SELECT date_debut AS date FROM conges 
            UNION 
            SELECT date FROM time_entries
        ) AS dates
        WHERE MONTH(date) != 0
        ORDER BY month ASC
    `;
    con.query(query, (err, months) => {
        if (err) {
            console.error("Erreur lors de l'exécution de la requête :", err);
            return res.status(500).json({ message: err.message });
        }
        
        return res.json(months);
    });
});



  
// Route pour récupérer les données d'absence des employés
router.get('/absences', (req, res) => {
    const { month, employeeName } = req.query; // Récupérer les paramètres de requête
    const query = `
        SELECT c.id, c.employee_id, DATE_ADD(c.date_debut, INTERVAL 1 DAY) AS date, DATE_ADD(c.date_fin, INTERVAL 1 DAY) AS endDate, employee.name AS employeeName  
        FROM conges c 
        INNER JOIN employee ON c.employee_id = employee.id 
        WHERE c.statut = "accepted" 
        AND MONTH(DATE_ADD(c.date_debut, INTERVAL 1 DAY)) = ? 
        AND employee.name = ?
    `;
    con.query(query, [month, employeeName], (err, absencesData) => {
        if (err) {
            console.error("Erreur lors de l'exécution de la requête :", err);
            return res.status(500).json({ message: err.message });
        }
        
        // Vérifiez si absencesData est un tableau
        if (Array.isArray(absencesData)) {
            // Si c'est le cas, renvoyez les données en tant que JSON
            return res.json(absencesData);
        } else {
            // Sinon, renvoyez un message d'erreur
            return res.status(500).json({ message: 'Les données d\'absence ne sont pas un tableau' });
        }
    });
});


// Route pour récupérer les données de présence des employés
router.get('/presences', (req, res) => {
    const { month, employeeName } = req.query; // Récupérer les paramètres de requête
    const query = `
        SELECT t.id, t.employee_id, DATE_FORMAT(t.date, "%Y-%m-%d") AS date,  employee.name AS employeeName 
        FROM time_entries t 
        INNER JOIN employee ON t.employee_id = employee.id 
        WHERE MONTH(t.date) = ? 
        AND employee.name = ?
    `;
    con.query(query, [month, employeeName], (err, presencesData) => {
        if (err) {
            console.error("Erreur lors de l'exécution de la requête :", err);
            return res.status(500).json({ message: err.message });
        }
        
        // Vérifiez si presencesData est un tableau
        if (Array.isArray(presencesData)) {
            // Si c'est le cas, renvoyez les données en tant que JSON
            return res.json(presencesData);
        } else {
            // Sinon, renvoyez un message d'erreur
            return res.status(500).json({ message: 'Les données de présence ne sont pas un tableau' });
        }
    });
});






















  export {router as ManagerRouter}