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
  
  

  



  export {router as ManagerRouter}