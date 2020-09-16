const database = require("../database")
const {asyncQuery} = require("../helper")

module.exports={
    getAddress: async(req,res)=>{
        const Id = parseInt(req.params.id)
        try {
<<<<<<< HEAD
=======
            // get address data
>>>>>>> 8e0f3a20723367c31c58c45e31b02db6531c5496
            const getAddress = `SELECT ua.id, ua.user_id, ua.address, ua.city, ua.province, ua.postcode, ua.latitude, ua.longitude, a.type FROM user_address ua
            LEFT JOIN address_type a on ua.address_type_id = a.id
            WHERE ua.user_id = ${database.escape(Id)}`
            const result = await asyncQuery(getAddress)
            res.status(200).send(result)
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    },
    editAddress: async(req,res)=>{
        const Id = parseInt(req.params.id)
        try {
             // check user id
             const checkId = `SELECT * FROM user_address WHERE user_id = ${database.escape(Id)}`
             const resultId = await asyncQuery(checkId)
 
             if(resultId.length === 0){
                 return res.status(400).send(`Users with id : ${Id} doesn\'t exists`)
             }
 
<<<<<<< HEAD
=======
            //  edit user address
>>>>>>> 8e0f3a20723367c31c58c45e31b02db6531c5496
             const edit = `UPDATE user_address SET ${generateQuery(req.body)}
                         WHERE user_id = ${database.escape(Id)}`
             const result = await asyncQuery(edit)
             res.status(200).send(result)
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    }
}