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








  export {router as EmployeeRouter}