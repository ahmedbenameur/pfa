import express, { response } from 'express';
import jwt from 'jsonwebtoken';  // Import jwt module
import con from '../utils/db.js';
import bcrypt from 'bcrypt';

const router = express.Router()

router.post("/employee_login", (req, res) => {
    const sql = "SELECT * from employee Where email = ?";
    con.query(sql, [req.body.email], (err, result) => {
      if (err) return res.json({ loginStatus: false, Error: "Query error" });
      if (result.length > 0) {
        bcrypt.compare(req.body.password, result[0].password, (err, response) => {
            if (err) return res.json({ loginStatus: false, Error: "Wrong Password" });
            if(response) {
                const email = result[0].email;
                const token = jwt.sign(
                    { role: "employee", email: email, id: result[0].id },
                    "jwt_secret_key",
                    { expiresIn: "1d" }
                );
                res.cookie('token', token)
                return res.json({ loginStatus: true, id: result[0].id });
            }
        })
        
      } else {
          return res.json({ loginStatus: false, Error:"wrong email or password" });
      }
    });
  });

  router.get('/detail/:id', (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM employee where id = ?"
    con.query(sql, [id], (err, result) => {
        if(err) return res.json({Status: false});
        return res.json(result)
    })
  })

router.get('/logout', (req, res) => {
    res.clearCookie('token')
    return res.json({Status: true})
})


// Ajoutez la route pour la demande de congé
router.post("/demande-conge", async (req, res) => {
  try {
    // Récupérez les données de la demande de congé depuis le corps de la requête
    const { employee_id, date_debut, date_fin, type, duree } = req.body;

    // Effectuez la requête pour insérer les données dans la table des congés
    const sql = "INSERT INTO conges (employee_id, date_debut, date_fin, statut, created_at, duree, type) VALUES (?, ?, ?, 'PENDING', NOW(), ?, ?)";
    
    await con.query(sql, [employee_id, date_debut, date_fin, duree, type]);

    // Envoyez une réponse en cas de succès
    res.json({ success: true, message: "Demande de congé enregistrée avec succès." });
  } catch (error) {
    console.error('Erreur lors de la demande de congé :', error);
    res.status(500).json({ success: false, message: "Erreur lors de la demande de congé." });
  }
});  

  
// Ajoutez une nouvelle route pour récupérer les congés d'un employé
router.get("/conges/:employee_id", (req, res) => {
  try {
    const employeeId = req.params.employee_id;

    // Effectuez la requête pour récupérer les congés de l'employé spécifié
    const sql = "SELECT * FROM conges WHERE employee_id = ?";
    con.query(sql, [employeeId], (err, result) => {
      if (err) {
        console.error('Erreur lors de la récupération des congés de l\'employé :', err);
        return res.status(500).json({ success: false, message: "Erreur lors de la récupération des congés de l'employé." });
      }

      res.json({ success: true, conges: result });
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des congés de l\'employé :', error);
    res.status(500).json({ success: false, message: "Erreur lors de la récupération des congés de l'employé." });
  }
});
  
// Ajout d'une route pour récupérer le solde de congé de tous les employés

router.get('/employee-conge-solde/:employee_id', async (req, res) => {
  const { employee_id } = req.params;

  // La requête sélectionne les dates de début et de fin pour les congés acceptés seulement.
  const sql = `
    SELECT type, date_debut, date_fin
    FROM conges
    WHERE employee_id = ? AND statut = 'accepted'
  `;

  con.query(sql, [employee_id], (err, results) => {
      if (err) {
          console.error("Erreur lors de la récupération du solde de congé :", err);
          return res.status(500).json({ success: false, message: "Erreur lors de la récupération du solde de congé." });
      }

      let soldeMaladie = 24;
      let soldeAnnuelle = 24;

      // Fonction pour calculer le nombre de jours ouvrables entre deux dates
      const getWorkingDays = (date_debut, date_fin) => {
        let count = 0;
        const start = new Date(date_debut);
        const end = new Date(date_fin);
        let current = new Date(start);

        while (current <= end) {
          // Les jours de la semaine vont de 0 (dimanche) à 6 (samedi)
          const dayOfWeek = current.getDay();
          if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Si ce n'est ni un samedi, ni un dimanche
            count++;
          }
          current.setDate(current.getDate() + 1);
        }

        return count;
      };

      // Calcule la durée en jours ouvrables pour chaque congé et décrémente les soldes
      results.forEach(row => {
        const days = getWorkingDays(row.date_debut, row.date_fin);
        if (row.type === 'Sick') soldeMaladie -= days; // Décrémente le solde de maladie
        else if (row.type === 'Annual') soldeAnnuelle -= days; // Décrémente le solde annuel
      });

      // Renvoie les soldes calculés au client
      res.json({ success: true, data: { soldeMaladie, soldeAnnuelle } });
  });
});


router.post("/demande-sortie", async (req, res) => {
  try {
    const { employee_id, date, heure_debut, heure_fin, description, duree } = req.body;

    // Effectuez la requête pour insérer les données dans la table des sorties
    const sql = "INSERT INTO sorties (employee_id, date, heure_debut, heure_fin, description, status, duree) VALUES (?, ?, ?, ?, ?, 'PENDING', ?)";
    
    await con.query(sql, [employee_id, date, heure_debut, heure_fin, description,duree]);

    res.json({ success: true, message: "Demande de sortie enregistrée avec succès." });
  } catch (error) {
    console.error('Erreur lors de la demande de sortie :', error);
    res.status(500).json({ success: false, message: "Erreur lors de la demande de sortie." });
  }
});


router.get("/sorties/:employee_id", (req, res) => {
  try {
    const employeeId = req.params.employee_id;

    // Effectuez la requête pour récupérer les sorties de l'employé spécifié
    const sql = "SELECT id, date, heure_debut, heure_fin, description, status, duree FROM sorties WHERE employee_id = ?";
    con.query(sql, [employeeId], (err, result) => {
      if (err) {
        console.error('Erreur lors de la récupération des sorties de l\'employé :', err);
        return res.status(500).json({ success: false, message: "Erreur lors de la récupération des sorties de l'employé." });
      }

      res.json({ success: true, sorties: result });
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des sorties de l\'employé :', error);
    res.status(500).json({ success: false, message: "Erreur lors de la récupération des sorties de l'employé." });
  }
});

router.get('/survey-categories', (req, res) => {
  const sql = "SELECT distinct category FROM surveyquestions";
  con.query(sql, (err, result) => {
      if(err) return res.json({Status: false, Error: "Query Error"})
      return res.json({Status: true, Result: result})
  })
})


router.get('/survey-questions/:category', (req, res) => {
  const category = req.params.category;
  const sql = "SELECT * FROM surveyquestions WHERE category = ?";
  
  con.query(sql, [category], (err, result) => {
    if (err) {
      console.error('Erreur lors de la récupération des questions du sondage :', err);
      return res.status(500).json({ Status: false, Error: "Erreur lors de la récupération des questions du sondage." });
    }

    console.log(result); // Log des résultats côté serveur
    return res.json({ Status: true, Result: result });
  });
});



router.post('/submit-survey', async (req, res) => {
  try {
    const { employee_id, responses } = req.body;

    console.log('Received survey responses:', responses);

    const insertResponsesSql = "INSERT INTO surveyresponses (employee_id, question_id, response) VALUES ?";

    if (employee_id) {
      const values = responses.map(response => [employee_id, response.question_id, response.response]);

      console.log('Values to be inserted:', values);

      await con.query(insertResponsesSql, [values]);

      res.json({ success: true, message: "Réponses au sondage enregistrées avec succès." });
    } else {
      console.error("L'ID de l'employé (employee_id) n'est pas défini.");
      res.status(400).json({ success: false, message: "L'ID de l'employé n'est pas défini." });
    }
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement des réponses au sondage :', error);
    res.status(500).json({ success: false, message: "Erreur lors de l'enregistrement des réponses au sondage." });
  }
});


router.get('/tasks/:employeeID', async (req, res) => {
  const { employeeID } = req.params;
  try {
    const sql = 'SELECT * FROM task WHERE employeeID = ?';
    con.query(sql, [employeeID], (err, result) => {
      if (err) {
        console.error('Erreur lors de la récupération des tâches:', err);
        return res.status(500).json({ success: false, message: "Erreur lors de la récupération des tâches." });
      }
      res.json({ success: true, Result: result });
    });
  } catch (error) {
    console.error('Erreur serveur lors de la récupération des tâches:', error);
    res.status(500).json({ success: false, message: "Erreur serveur lors de la récupération des tâches." });
  }
});
router.put('/tasks/:taskId/status', async (req, res) => {
  const { taskId } = req.params;
  const { status } = req.body;
  try {
    const sql = 'UPDATE task SET status = ? WHERE id = ?';
    con.query(sql, [status, taskId], (err, result) => {
      if (err) {
        console.error('Erreur lors de la mise à jour du statut de la tâche:', err);
        return res.status(500).json({ success: false, message: "Erreur lors de la mise à jour du statut de la tâche." });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: "Tâche non trouvée." });
      }
      res.json({ success: true, message: "Statut de la tâche mis à jour avec succès." });
    });
  } catch (error) {
    console.error('Erreur serveur lors de la mise à jour du statut de la tâche:', error);
    res.status(500).json({ success: false, message: "Erreur serveur lors de la mise à jour du statut de la tâche." });
  }
});


router.post('/clock-in', (req, res) => {
  const currentTime = new Date().toISOString(); // Utiliser toISOString

  const checkEntryQuery = 'SELECT * FROM time_entries WHERE employee_id = ? AND DATE = CURDATE()';
  con.query(checkEntryQuery, [req.body.employee_id], (err, result) => {
    if (err) {
      console.error('Erreur lors de la vérification du pointage:', err);
      return res.status(500).json({ Status: false, Error: "Erreur lors de la vérification du pointage." });
    }

    if (result.length > 0) {
      return res.status(400).json({ Status: false, Error: "Vous avez déjà enregistré un pointage aujourd'hui." });
    } else {
      const insertEntryQuery = 'INSERT INTO time_entries (employee_id, start_time, date) VALUES (?, now(), CURDATE())';
      con.query(insertEntryQuery, [req.body.employee_id, currentTime], (err, result) => {
        if (err) {
          console.error('Erreur lors de l\'enregistrement du pointage:', err);
          return res.status(500).json({ Status: false, Error: "Erreur lors de l'enregistrement du pointage." });
        }
        return res.status(200).json({ Status: true, Message: "Pointage enregistré avec succès." });
      });
    }
  });
});

router.post('/clock-out', (req, res) => {
  const currentTime = new Date().toISOString();

  const updateEntryQuery = 'UPDATE time_entries SET end_time = now() WHERE employee_id = ? AND end_time IS NULL';

  con.query(updateEntryQuery, [req.body.employee_id], (err, result) => {
    if (err) {
      console.error('Erreur lors de la mise à jour du pointage de sortie:', err);
      return res.status(500).json({ Status: false, Error: "Erreur lors de la mise à jour du pointage de sortie." });
    }

    if (result.affectedRows > 0) {
      // Effectuez ici le calcul des heures travaillées pour l'entrée mise à jour
      const calculateHoursQuery = 'UPDATE time_entries SET hours_worked = TIMESTAMPDIFF(HOUR, start_time, end_time) - 1.25 WHERE employee_id = ? AND hours_worked IS NULL';
      
      con.query(calculateHoursQuery, [req.body.employee_id], (calcErr, calcResult) => {
        if (calcErr) {
          console.error('Erreur lors du calcul des heures travaillées:', calcErr);
          return res.status(500).json({ Status: false, Error: "Erreur lors du calcul des heures travaillées." });
        }
        return res.status(200).json({ Status: true, Message: "Pointage de sortie et calcul des heures travaillées enregistrés avec succès." });
      });
    } else {
      return res.status(400).json({ Status: false, Error: "Aucun pointage d'entrée correspondant n'a été trouvé pour mise à jour." });
    }
  });
});


router.post('/hours-worked', async (req, res) => {
  // Assurez-vous que `con` est promisifié ou utilisez une bibliothèque de support de promesses MySQL.
  
  // Première étape: Mise à jour préliminaire des heures travaillées en fonction de start_time et end_time
  const updateHoursWorked = `
    UPDATE time_entries
    SET hours_worked = TIMESTAMPDIFF(HOUR, start_time, end_time)
    WHERE hours_worked IS NULL OR status = 0;`;

  try {
    await con.promise().query(updateHoursWorked);

    // Deuxième étape: Ajustement des heures travaillées en soustrayant la durée des sorties acceptées
    const adjustHoursForLeaves = `
      UPDATE time_entries te
      INNER JOIN (
        SELECT employee_id, DATE(date) as sortie_date, SUM(TIMESTAMPDIFF(HOUR, heure_debut, heure_fin)) as total_sortie_hours
        FROM sorties
        WHERE status = 'accepted'
        GROUP BY employee_id, DATE(date)
      ) as sortie ON te.employee_id = sortie.employee_id AND DATE(te.date) = sortie.sortie_date
      SET te.hours_worked = GREATEST(0, te.hours_worked - sortie.total_sortie_hours)
      WHERE te.status = 0;`;

    const [adjustmentResult] = await con.promise().query(adjustHoursForLeaves);
    const affectedRows = adjustmentResult.affectedRows;

    res.status(200).json({ Status: true, Message: `${affectedRows} time entries adjusted successfully.` });
  } catch (err) {
    console.error('Error adjusting hours worked:', err);
    res.status(500).json({ Status: false, Error: "Error adjusting hours worked." });
  }
});

router.get('/time-entries', (req, res) => {
  const employeeId = req.query.employee_id; // Récupérer l'ID de l'employé depuis les paramètres de requête
  
  const getEntriesQuery = 'SELECT * FROM time_entries WHERE employee_id = ?';
  con.query(getEntriesQuery, [employeeId], (err, result) => {
    if (err) {
      console.error('Erreur lors de la récupération des pointages:', err);
      return res.status(500).json({ Status: false, Error: "Erreur lors de la récupération des pointages." });
    }
    return res.status(200).json({ Status: true, Result: result });
  });
});


router.get('/timeentries/:entryId', (req, res) => {
  const { entryId } = req.params;
  const getEntryQuery = 'SELECT * FROM time_entries WHERE id = ?';
  con.query(getEntryQuery, [entryId], (err, result) => {
    if (err) {
      console.error('Error fetching time entry:', err);
      return res.status(500).json({ Status: false, Error: "Error fetching time entry." });
    }
    return res.status(200).json({ Status: true, Result: result });
  });
});

router.put('/editpointage/:entryId', (req, res) => {
  const entryId = req.params.entryId;
  const {  endTime, totalWorked } = req.body;

  console.log('Received data for entry update:', { entryId, endTime, totalWorked });

  const updateQuery = 'UPDATE time_entries SET end_time = ?, hours_worked = ? WHERE id = ?';

  con.query(updateQuery, [ endTime, totalWorked, entryId], (err, result) => {
    if (err) {
      console.error('Error updating entry:', err);
      return res.status(500).json({ status: false, error: 'Error updating entry.' });
    }
    return res.status(200).json({ status: true, message: 'Entry updated successfully.' });
  });
});


router.post("/deplacements", async (req, res) => {
  try {
    // Récupérer les données de la demande de déplacement depuis le corps de la requête
    const { employeeId, departureDate, returnDate, destination, reason } =
      req.body;

    // Effectuer la requête pour insérer les données dans la table de déplacement
    const sql =
      "INSERT INTO deplacement (employee_id, departure_date, return_date, destination, reason) VALUES (?, ?, ?, ?, ?)";

    await con.query(sql, [
      employeeId,
      departureDate,
      returnDate,
      destination,
      reason,
    ]);

    // Envoyer une réponse en cas de succès
    res.json({
      success: true,
      message: "Demande de déplacement enregistrée avec succès.",
    });
  } catch (error) {
    console.error("Erreur lors de la demande de déplacement :", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la demande de déplacement.",
    });
  }
});

router.get("/deplacements/:employee_id", (req, res) => {
  try {
    const employeeId = req.params.employee_id;

    // Effectuez la requête pour récupérer les congés de l'employé spécifié
    const sql = "SELECT * FROM deplacement WHERE employee_id = ?";
    con.query(sql, [employeeId], (err, result) => {
      if (err) {
        console.error(
          "Erreur lors de la récupération des congés de l'employé :",
          err
        );
        return res.status(500).json({
          success: false,
          message: "Erreur lors de la récupération des congés de l'employé.",
        });
      }

      res.json({ success: true, conges: result });
    });
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des congés de l'employé :",
      error
    );
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des congés de l'employé.",
    });
  }
});


router.put('/editpointage/:entryId', (req, res) => {
  const entryId = req.params.entryId;
  const {  endTime, totalWorked } = req.body;

  console.log('Received data for entry update:', { entryId, endTime, totalWorked });

  const updateQuery = 'UPDATE time_entries SET end_time = ?, hours_worked = ? WHERE id = ?';

  con.query(updateQuery, [ endTime, totalWorked, entryId], (err, result) => {
    if (err) {
      console.error('Error updating entry:', err);
      return res.status(500).json({ status: false, error: 'Error updating entry.' });
    }
    return res.status(200).json({ status: true, message: 'Entry updated successfully.' });
  });
});



  export {router as EmployeeRouter}