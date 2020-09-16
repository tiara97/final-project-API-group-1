const mysql = require('mysql')

<<<<<<< HEAD
=======
// connect to mysql database
>>>>>>> 8e0f3a20723367c31c58c45e31b02db6531c5496
const database = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
})

module.exports = database