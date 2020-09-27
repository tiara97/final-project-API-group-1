const CryptoJS = require("crypto-js")  
const dotenv = require('dotenv')

dotenv.config()

const SECRET_KEY = process.env.SECRET_KEY               
const pass = "admin0" 
const hashPass = CryptoJS.HmacMD5(pass, SECRET_KEY)
console.log(hashPass.toString())
