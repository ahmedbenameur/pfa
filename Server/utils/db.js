import mysql from 'mysql2'

const con = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER ,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
})

con.connect(function(err) {
    if(err) {
        console.log(err)
        console.log("connection error")
    }else{
        console.log("Connected")
    }
})

export default con;
