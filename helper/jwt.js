const jwt = require("jsonwebtoken")
const TOKEN_KEY = process.env.TOKEN_KEY

module.exports = {
    // create token
    createToken: (data)=>{
        return jwt.sign(data, TOKEN_KEY, {expiresIn: "1hr"})
    },
    // verify token as middleware
    verify: (req,res,next)=>{
        const token = req.body.token
        try {
            if(!token){
                return res.status(400).send("No token!")
            }
            // verify tokenn
            const result = jwt.verify(token, TOKEN_KEY)

            // add token data to req
            req.data = result

            // next
            next()
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    }
}