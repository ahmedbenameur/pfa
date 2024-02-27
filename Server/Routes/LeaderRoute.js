import express, { response } from 'express';
import jwt from 'jsonwebtoken';  // Import jwt module
import con from '../utils/db.js';
import bcrypt from 'bcrypt';

const router = express.Router()

router.post("/leader_login", (req, res) => {
    const sql = "SELECT * from leader Where email = ?";
    con.query(sql, [req.body.email], (err, result) => {
        if (err) return res.json({ loginStatus: false, Error: "Query error" });

        // Check if any user is found with the provided email
        if (result.length > 0) {
            // Directly compare the provided password with the one in the database
            if(req.body.password === result[0].password) {
                // Passwords match
                const email = result[0].email;
                const token = jwt.sign(
                    { role: "leader", email: email, id: result[0].id },
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

router.post('/projects', (req, res) => {
    const sql = "INSERT INTO projects (`name`) VALUES (?)"
    con.query(sql,[req.body.projects], (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true})
    })
    
})

router.get('/projectList', (req, res) => {
    const sql = "SELECT * FROM projects";
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true, Result: result})
    })
})

router.get('/tasks', (req, res) => {
    const sql = "SELECT * FROM task";
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true, Result: result})
    })
})

router.post('/add_task', (req, res) => {
    const { name, status, projectID, employeeID } = req.body;

    // Exemple de validation simple
    if (!name || !status || !projectID || !employeeID) {
        return res.json({ Status: false, Error: "Missing required fields" });
    }

    // Vérification de l'existence de projectID et employeeID
    const checkExistence = `SELECT (SELECT EXISTS(SELECT 1 FROM projects WHERE id = ?)) AS projectExists, 
                                    (SELECT EXISTS(SELECT 1 FROM employee WHERE id = ?)) AS employeeExists`;
    con.query(checkExistence, [projectID, employeeID], (err, existenceResult) => {
        if (err) {
            return res.json({ Status: false, Error: "Query Error on checking existence" });
        }
        if (!existenceResult[0].projectExists || !existenceResult[0].employeeExists) {
            return res.json({ Status: false, Error: "Project or Employee does not exist" });
        }

        // Si les IDs existent, on procède à l'insertion
        const sql = 'INSERT INTO task (name, status, projectID, employeeID) VALUES (?, ?, ?, ?)';
        con.query(sql, [name, status, projectID, employeeID], (err, result) => {
            if (err) {
                return res.json({ Status: false, Error: "Query Error on insertion" });
            }
            return res.json({ Status: true });
        });
    });
});
// Dans votre fichier de routes, ajoutez un handler pour la route de suppression
router.delete('/delete_task/:id', (req, res) => {
    const { id } = req.params; // Obtenez l'ID de la tâche à supprimer
    
   const sql=  `
   SELECT tasks.id, tasks.name AS taskName, tasks.status, 
          projects.name AS projectName, employees.name AS employeeName
   FROM tasks
   JOIN projects ON tasks.projectID = projects.id
   JOIN employees ON tasks.employeeID = employees.id;
`;

    con.query(sql, [id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error deleting the task");
        }
        res.status(200).send("Task deleted successfully");
    });
});


router.get('/conges', (req, res) => {
    const sql = "SELECT * FROM conges";
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true, Result: result})
    })
})

// Endpoint pour récupérer le statut du congé par ID
router.get('/conges/:id', (req, res) => {
    const { id } = req.params;
    // Assurez-vous d'ajuster la requête SQL en fonction de votre structure de base de données
    const sql = "SELECT statut FROM conges WHERE id = ?";
    // Exécutez la requête SQL
    con.query(sql, [id], (err, result) => {
      if (err) {
        console.error('Erreur lors de la récupération du statut du congé par ID:', err);
        return res.status(500).json({ Status: false, Error: 'Query Error' });
      }
  
      if (result.length === 0) {
        return res.status(404).json({ Status: false, Error: 'Conge not found' });
      }
  
      const status = result[0].statut;
      res.json({ Status: true, Result: { id, status } });
    });
  });

// Endpoint pour mettre à jour le statut du congé
router.put('/update_conge_status/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
  
    const sql = "UPDATE conges SET statut = ? WHERE id = ?";
      con.query(sql, [status, id], (err, result) => {
      if (err) {
        console.error('Erreur lors de la mise à jour du statut du congé:', err);
        return res.status(500).json({ Status: false, Error: 'Update Error' });
      }
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ Status: false, Error: 'Conge not found' });
      }
  
      res.json({ Status: true, Result: { id, status } });
    });
  });


  router.get('/sorties', (req, res) => {
    const sql = "SELECT * FROM sorties";
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true, Result: result})
    })
})

// Endpoint pour récupérer le statut du congé par ID
router.get('/sorties/:id', (req, res) => {
    const { id } = req.params;
    // Assurez-vous d'ajuster la requête SQL en fonction de votre structure de base de données
    const sql = "SELECT status FROM sorties WHERE id = ?";
    // Exécutez la requête SQL
    con.query(sql, [id], (err, result) => {
      if (err) {
        console.error('Erreur lors de la récupération du statut du sortie par ID:', err);
        return res.status(500).json({ Status: false, Error: 'Query Error' });
      }
  
      if (result.length === 0) {
        return res.status(404).json({ Status: false, Error: 'Sortie not found' });
      }
  
      const status = result[0].status;
      console.log('Statut récupéré pour la sortie ID', id, ':', status); // Ajoutez ce journal
      res.json({ Status: true, Result: { id, status } });
    });
  });
  

  // Endpoint pour mettre à jour le statut du congé
router.put('/update_sortie_status/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
  
    const sql = "UPDATE sorties SET status = ? WHERE id = ?";
      con.query(sql, [status, id], (err, result) => {
      if (err) {
        console.error('Erreur lors de la mise à jour du statut du sortie:', err);
        return res.status(500).json({ Status: false, Error: 'Update Error' });
      }
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ Status: false, Error: 'Conge not found' });
      }
  
      res.json({ Status: true, Result: { id, status } });
    });
  });
  

  export {router as LeaderRouter}