const database = require("../database")
const {validationResult} = require("express-validator")
const nodemailer = require("nodemailer")
const CryptoJS = require("crypto-js")
const {asyncQuery, generateQuery} = require("../helper/queryHelper")
const { createToken } = require("../helper/jwt")

const SECRET_KEY = process.env.SECRET_KEY
const GMAIL = process.env.GMAIL
const PASS_GMAIL = process.env.PASS_GMAIL

module.exports={
    getUsersData: async(req,res)=>{
        try {
            const getUsers = `SELECT * FROM users`
            const result = await asyncQuery(getUsers)
            res.status(200).send(result)
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    },
    getUsersDataAdmin: async(req,res)=>{
        try {
            // get all users data
            const getUsers = `SELECT u.id, u.username, u.email, u.role_id, u.status_id, up.user_fullname, up.phone, up.gender, up.image, 
                            up.main_address_id, GROUP_CONCAT(ua.id) AS address_id,GROUP_CONCAT(ua.address) AS address, GROUP_CONCAT(ua.city) AS city, 
                            GROUP_CONCAT(ua.province) AS province, GROUP_CONCAT(ua.postcode) AS postcode, GROUP_CONCAT(at.type) AS address_type , 
                            GROUP_CONCAT(ua.latitude) AS latitude, GROUP_CONCAT(ua.longitude) AS longitude,  ur.role, us.status FROM users u 
                            LEFT JOIN user_profiles up ON u.id = up.user_id
                            LEFT JOIN user_address ua ON u.id = ua.user_id
                            LEFT JOIN user_roles ur ON u.role_id = ur.id
                            LEFT JOIN user_status us ON u.status_id = us.id
                            LEFT JOIN address_type at ON ua.address_type_id = at.id
                            GROUP BY u.id`
            const result = await asyncQuery(getUsers)

            // convert data to array
            result.forEach((item)=>{
                item.address_id? (item.address_id = item.address_id.split(",")) : null
                item.address? (item.address = item.address.split(",")) : null
                item.city? (item.city = item.city.split(",")) : null
                item.province? (item.province = item.province.split(",")) : null
                item.postcode? (item.postcode = item.postcode.split(",")) : null
                item.address_type? (item.address_type = item.address_type.split(",")) : null
                item.latitude? (item.latitude = item.latitude.split(",")) : null
                item.longitude? (item.longitude = item.longitude.split(",")) : null
                })
            
            res.status(200).send(result)
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    },
    getUsersDataAdminByID: async(req,res)=>{
        const ID = req.params.id
        try {
            // get all users data
            const getUsers = `SELECT u.id, u.username, u.email, u.role_id, u.status_id, up.user_fullname, up.phone, up.gender, up.image, 
                            up.main_address_id, GROUP_CONCAT(ua.id) AS address_id,GROUP_CONCAT(ua.address) AS address, GROUP_CONCAT(ua.city) AS city, 
                            GROUP_CONCAT(ua.province) AS province, GROUP_CONCAT(ua.postcode) AS postcode, GROUP_CONCAT(at.type) AS address_type , 
                            GROUP_CONCAT(ua.latitude) AS latitude, GROUP_CONCAT(ua.longitude) AS longitude,  ur.role, us.status FROM users u 
                            LEFT JOIN user_profiles up ON u.id = up.user_id
                            LEFT JOIN user_address ua ON u.id = ua.user_id
                            LEFT JOIN user_roles ur ON u.role_id = ur.id
                            LEFT JOIN user_status us ON u.status_id = us.id
                            LEFT JOIN address_type at ON ua.address_type_id = at.id
                            JOIN orders o ON o.user_id = u.id
                            JOIN warehouse w ON o.warehouse_id = w.id
							WHERE w.admin_id = ${ID}
                            GROUP BY u.id`
            const result = await asyncQuery(getUsers)

            // convert data to array
            result.forEach((item)=>{
                item.address_id? (item.address_id = item.address_id.split(",")) : null
                item.address? (item.address = item.address.split(",")) : null
                item.city? (item.city = item.city.split(",")) : null
                item.province? (item.province = item.province.split(",")) : null
                item.postcode? (item.postcode = item.postcode.split(",")) : null
                item.address_type? (item.address_type = item.address_type.split(",")) : null
                item.latitude? (item.latitude = item.latitude.split(",")) : null
                item.longitude? (item.longitude = item.longitude.split(",")) : null
                })
            
            res.status(200).send(result)
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    },
    getUsersByQuery: async(req,res)=>{
        let query = "";
        for (let key in req.query) {
          query += `${key} = ${database.escape(req.query[key])} AND `;
        }
        console.log(query.slice(0,-4))
        
        try {
            // get all users data
            const getUsers = `SELECT u.id, u.username, u.password, u.email, u.role_id, u.status_id, up.user_fullname, up.phone, up.gender, up.image, 
                            up.main_address_id, GROUP_CONCAT(ua.id) AS address_id,GROUP_CONCAT(ua.address) AS address, GROUP_CONCAT(ua.city) AS city, 
                            GROUP_CONCAT(ua.province) AS province, GROUP_CONCAT(ua.postcode) AS postcode, GROUP_CONCAT(at.type) AS address_type , 
                            GROUP_CONCAT(ua.latitude) AS latitude, GROUP_CONCAT(ua.longitude) AS longitude,  ur.role, us.status FROM users u 
                            LEFT JOIN user_profiles up ON u.id = up.user_id
                            LEFT JOIN user_address ua ON u.id = ua.user_id
                            LEFT JOIN user_roles ur ON u.role_id = ur.id
                            LEFT JOIN user_status us ON u.status_id = us.id
                            LEFT JOIN address_type at ON ua.address_type_id = at.id
                            ${query !== ""? (`WHERE ${query.slice(0,-4)}`) : ("")}
                            GROUP BY u.id`
            const result = await asyncQuery(getUsers)

            // convert data to array
            result.forEach((item)=>{
                item.address_id? (item.address_id = item.address_id.split(",")) : null
                item.address? (item.address = item.address.split(",")) : null
                item.city? (item.city = item.city.split(",")) : null
                item.province? (item.province = item.province.split(",")) : null
                item.postcode? (item.postcode = item.postcode.split(",")) : null
                item.address_type? (item.address_type = item.address_type.split(",")) : null
                item.latitude? (item.latitude = item.latitude.split(",")) : null
                item.longitude? (item.longitude = item.longitude.split(",")) : null
                })
            
            res.status(200).send(result)
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    },
    register: async(req,res)=>{
        const { username, password, confPassword, email, user_fullname, phone, address, city, province, postcode, latitude, longitude } = req.body
        const error = validationResult(req)

        // check input with express validator
        if(!error.isEmpty()){
            return res.status(422).send({errors: error.array()[0].msg})
            // return res.status(422).send({errors: error.array().map((item)=> item.msg)})
        }

        // check password === confPassword?
        if(password !== confPassword){
            return res.status(400).send({errors: "Password doesn't match!"})
        }

        try {
            // check user already registered?
            const checkUser = `SELECT * FROM users WHERE username = ${database.escape(username)} OR email = ${database.escape(email)}`
            const resultCheck = await asyncQuery(checkUser)

            if(resultCheck.length > 0){
                return res.status(422).send({errors:"Username or email already used"})
            }

            const hashPass = CryptoJS.HmacMD5(password, SECRET_KEY)

            // add to users table
            const addUSer = `INSERT INTO users (username, password, email, role_id, status_id)
                            VALUES (${database.escape(username)}, ${database.escape(hashPass.toString())}, ${database.escape(email)}, 3, 2)`
            const resultAdd = await asyncQuery(addUSer)

            const new_user_id = resultAdd.insertId
            req.body.id = new_user_id
            
            // add to profile table
            const addProfile = `INSERT INTO user_profiles (user_id, user_fullname, phone) VALUES (${database.escape(new_user_id)}, ${database.escape(user_fullname)}, ${database.escape(phone)}) `
            const resultAddProfile = await asyncQuery(addProfile)

            // add to address table
            const addAddress = `INSERT INTO user_address(user_id, address, city, province, postcode, latitude, longitude) VALUES (${database.escape(new_user_id)}, ${database.escape(address)}, ${database.escape(city)}, ${database.escape(province)}, ${database.escape(postcode)}, ${database.escape(latitude)}, ${database.escape(longitude)}) `
            const resultAddAddress = await asyncQuery(addAddress)

            // create token
            const token = createToken({id: new_user_id, username: username})

            let testAccount =  await nodemailer.createTestAccount()
            // setup nodemailer
            let transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                  user: GMAIL,
                  pass: PASS_GMAIL,
                },
                tls: {
                  rejectUnauthorized: true,
                },
            });

            // send email verification to uuser
            const option = {
                from: "admin <finalprojectjcwm13@example.com>",
                to: `${email}`,
                subject: "Email verification",
                text: "",
                html: `<h1>Congratulation! You've been registered on my website!</h1>
                <h3>Click link below to activate your account!<h3>
                <a href="http://localhost:3000/Verifikasi?${token}">http://localhost:3000/Verifikasi?${token}</a>`
            }

            const result = await transporter.sendMail(option)

            console.log("Message sent: %s", result.messageId)

            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(option))
            
            req.body.token = token
            res.status(200).send(req.body)
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    },
    emailVerification: async(req,res)=>{
        try {
            // activate account

            const setStatus = `UPDATE users SET status_id = 1
                                WHERE id = ${database.escape(req.data.id)}
                                AND username = ${database.escape(req.data.username)}`
            const result = await asyncQuery(setStatus)

            res.status(200).send("Email has been verified!")
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    },
    login: async(req, res)=>{
        const {username, email, password} = req.body
        try {
            // login using username or email
            let login = `SELECT * FROM users WHERE `
                if(username === undefined){
                    login += `email = ${database.escape(email)}`
                } else if(email === undefined){
                    login += `username = ${database.escape(username)}`
                }
            const result = await asyncQuery(login)
           
            // check username or email
            if(result.length === 0){
                return res.status(400).send("Username or email not registered")
            }

            // check password
            const hashPass = CryptoJS.HmacMD5(password, SECRET_KEY)
            if(hashPass.toString() !== result[0].password){
                return res.status(400).send("Password invalid!")
            }
            // check status admin
            if(result[0].role_id === 2) {
                const checkWH = `SELECT id FROM warehouse WHERE admin_id =${result[0].id}`
                const resultWH = await asyncQuery(checkWH)
                result[0].wh_id = resultWH[0].id
            }
            // create token
            const token = createToken({
                id: result[0].id,
                username: result[0].username
            })
            console.log("token : ", token)

            result[0].token = token

            res.status(200).send(result[0])
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    },
    keepLogin: async(req,res)=>{
        try {
            const keepLogin = `SELECT * FROM users
                                 WHERE id=${req.data.id} AND username='${req.data.username}'`;
            const result = await asyncQuery(keepLogin);
            if(result[0].role_id === 2) {
                const checkWH = `SELECT id FROM warehouse WHERE admin_id =${result[0].id}`
                const resultWH = await asyncQuery(checkWH)
                result[0].wh_id = resultWH[0].id
            }
            console.log("result : ", result);
            res.status(200).send(result[0]);
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    },
    editUser: async(req,res)=>{
        const Id = parseInt(req.params.id)
        try {
            // check user id
            const checkId = `SELECT * FROM users WHERE id = ${database.escape(Id)}`
            const resultId = await asyncQuery(checkId)

            if(resultId.length === 0){
                return res.status(400).send(`Users with id : ${Id} doesn\'t exists`)
            }

            const edit = `UPDATE users SET ${generateQuery(req.body)}
                        WHERE id = ${database.escape(Id)}`
            const result = await asyncQuery(edit)
            res.status(200).send(result)
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    },
    editPassword: async(req,res)=>{
        const Id = req.params.id
        const {password, newpassword, confnewpassword} = req.body

        // check confpassword
        if(newpassword !== confnewpassword){
            return res.status(400).send("Password doesn't match")
        }

        // check error
        const errorValidation = validationResult(req)
        if(!errorValidation.isEmpty()){
            return res.status(422).send({errors: errorValidation.array()})
        }

        try {
            const checkId = `SELECT password FROM users WHERE id = ${database.escape(Id)}`
            const resultId = await asyncQuery(checkId)

            if(resultId.length === 0){
                return res.status(200).send(`Users with id : ${Id} doesn\'t exists!`)
            }

            const hashNewPass = CryptoJS.HmacMD5(newpassword, SECRET_KEY)
            const editPass = `UPDATE users SET password = ${database.escape(hashNewPass.toString())}
                            WHERE id = ${database.escape(Id)}`
            const result = await asyncQuery(editPass)
            res.status(200).send(result)
        } catch (error) {
            console.logg(error)
            res.status(500).send(error)
        }
    }
}