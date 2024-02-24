import express from 'express';
import jwt from 'jsonwebtoken';  // Import jwt module
import con from '../utils/db.js';
import bcrypt from 'bcrypt';
import path from "path";
import multer from 'multer';

const router = express.Router();

router.post('/adminlogin', (req, res) => {
    const sql = "SELECT * from admin where email = ? and password = ?";
    con.query(sql, [req.body.email, req.body.password], (err, result) => {
        if (err) return res.json({ loginStatus: false, Error: "Query error" });
        if (result.length > 0) {
            const email = result[0].email;
            const token = jwt.sign(
                { role: "admin", email: email , id: result[0].id},
                "jwt_secret_key",
                { expiresIn: '1d' }
            );
            res.cookie('token', token);
            return res.json({ loginStatus: true });
        } else {
            return res.json({ loginStatus: false, Error: "wrong email or password" });
        }
    });
});

router.get('/category', (req, res) => {
    const sql = "SELECT * FROM category";
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true, Result: result})
    })
})


router.post('/add_category', (req, res) => {
    const sql = "INSERT INTO category (`name`) VALUES (?)"
    con.query(sql,[req.body.category], (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true})
    })
    
})
// image upload 
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'Public/Images')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({
    storage: storage
})
// end imag eupload 

router.post('/add_employee',upload.single('image'), (req, res) => {
    const sql = `INSERT INTO employee 
    (name,email,password, address, salary,image, category_id) 
    VALUES (?)`;
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        const values = [
            req.body.name,
            req.body.email,
            hash,
            req.body.address,
            req.body.salary, 
            req.file.filename,
            req.body.category_id
        ]
        con.query(sql, [values], (err, result) => {
            if(err) return res.json({Status: false, Error: err})
            return res.json({Status: true})
        })
    })
})

router.get('/employee', (req, res) => {
    const sql = "SELECT * FROM employee";
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true, Result: result})
    })
})

router.post('/add_leader', (req, res) => {
    const { name, email, password } = req.body;
    
    // Vérification que les champs ne sont pas vides
    if (!name || !email || !password) {
        return res.status(400).json({Status: false, Error: "All fields are required"});
    }
// Définition de la requête SQL avec des placeholders pour les valeurs
const sql = `INSERT INTO leader (name, email, password) VALUES (?, ?, ?)`;

// Préparation des valeurs à insérer, incluant le mot de passe en clair (non hashé)
const values = [
    req.body.name,
    req.body.email,
    req.body.password, // Ici, le mot de passe n'est pas hashé
];

// Exécution de la requête SQL
con.query(sql, values, (err, result) => { // Correction ici: utilisation de "values" directement
    // Gestion de l'erreur de la requête SQL
    if(err) {
        console.error("SQL Error:", err.message); // Log de l'erreur SQL pour le débogage
        return res.json({Status: false, Error: "SQL Error"});
    }
    // Réponse en cas de succès
    return res.json({Status: true});
});
});


router.post('/add_manager', (req, res) => {
    const { name, email, password } = req.body;
    
    // Vérification que les champs ne sont pas vides
    if (!name || !email || !password) {
        return res.status(400).json({Status: false, Error: "All fields are required"});
    }
// Définition de la requête SQL avec des placeholders pour les valeurs
const sql = `INSERT INTO manager (name, email, password) VALUES (?, ?, ?)`;

// Préparation des valeurs à insérer, incluant le mot de passe en clair (non hashé)
const values = [
    req.body.name,
    req.body.email,
    req.body.password, // Ici, le mot de passe n'est pas hashé
];

// Exécution de la requête SQL
con.query(sql, values, (err, result) => { // Correction ici: utilisation de "values" directement
    // Gestion de l'erreur de la requête SQL
    if(err) {
        console.error("SQL Error:", err.message); // Log de l'erreur SQL pour le débogage
        return res.json({Status: false, Error: "SQL Error"});
    }
    // Réponse en cas de succès
    return res.json({Status: true});
});
});




router.get('/manager', (req, res) => {
const sql = "SELECT * FROM manager";
con.query(sql, (err, result) => {
    if(err) return res.json({Status: false, Error: "Query Error"})
    return res.json({Status: true, Result: result})
})
})
router.get('/leader', (req, res) => {
    const sql = "SELECT * FROM  leader";
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true, Result: result})
    })
    })


router.get('/employee/:id', (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM employee Where id = ?";
    con.query(sql,[id] ,(err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true, Result: result})
    })
})

router.put('/edit_employee/:id', (req, res) => {
    const id = req.params.id;
    const sql = `UPDATE employee 
        set name = ?, email = ?, salary = ?, address = ?, category_id = ? 
        Where id = ?`
    const values = [
        req.body.name,
        req.body.email,
        req.body.salary,
        req.body.address,
        req.body.category_id
    ]
    con.query(sql,[...values, id], (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"+err})
        return res.json({Status: true, Result: result})
    })
})

router.delete('/delete_employee/:id', (req, res) => {
    const id = req.params.id;
    const sql = "delete FROM employee Where id = ?";
    con.query(sql,[id] ,(err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true, Result: result})
    })
})

router.get('/admin_count',(req, res) => {
    const sql = "select count(id) as admin from admin";
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true, Result: result})
    })
})

router.get('/employee_count',(req, res) => {
    const sql = "select count(id) as employee from employee";
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true, Result: result})
    })
})

router.get('/salary_count',(req, res) => {
    const sql = "select sum(salary) as salaryOFEmp from employee";
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true, Result: result})
    })
})

router.get('/admin_records',(req, res) => {
    const sql = "select * from admin";
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true, Result: result})
    })
})

router.get('/logout', (req, res) => {
    try {
        res.clearCookie('token');
        return res.json({ Status: true, Result: "Logout successful" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ Status: false, Error: "Internal Server Error" });
    }
});





export { router as adminRouter };
