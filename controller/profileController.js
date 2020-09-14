const database = require('../database')

module.exports={
    getProfile: async(req,res)=>{
        const Id = parseInt(req.params.id)
        try {
            
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    }
}