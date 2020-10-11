const database = require("../database")
const {asyncQuery} = require("../helper/queryHelper")

module.exports = {
    getOngkirData: async(req,res)=>{
        try {
            const query = `SELECT * FROM delivery_fee`
            const result = await asyncQuery(query)
            res.status(200).send(result)
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    }
}