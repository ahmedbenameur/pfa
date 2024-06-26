import express from "express"; 
import cors from 'cors'
import { adminRouter } from "./Routes/AdminRoute.js";
import { EmployeeRouter } from "./Routes/EmployeeRoute.js";
import Jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { ManagerRouter } from "./Routes/ManagerRoute.js";
import { LeaderRouter } from "./Routes/LeaderRoute.js";

const app = express()
app.use(cors({
    origin: ["http://192.168.49.2:30000/"],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true

}))
app.use(express.json())
app.use(cookieParser())
app.use('/auth', adminRouter)
app.use('/employee', EmployeeRouter)
app.use('/manager', ManagerRouter)
app.use('/leader', LeaderRouter)
app.use(express.static('Public'))

const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if(token){
        Jwt.verify(token, "jwt_secret_key", (err, decoded) => {
            if(err) return res.json({Status: false, Error:"Wrong Token"})
            req.id = decoded.id;
            req.role = decoded.role;
            next()
        })
    } else {
        return res.json({Status: false, Error: "Not authenticated"})
    }
}

app.get('/verify', verifyUser, (req, res) =>{
    return res.json({Status: true, role: req.role, id: req.id})
})
app.listen(3000, () =>{
    console.log("Server is running")
})