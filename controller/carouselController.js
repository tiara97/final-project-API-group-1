const database = require("../database")
const { asyncQuery } = require("../helper/queryHelper")

module.exports={
    getCarouselData: async(req,res)=>{
        try {
<<<<<<< HEAD
=======
            // get carousel
>>>>>>> 8e0f3a20723367c31c58c45e31b02db6531c5496
            const getCarousel = `SELECT * FROM carousel`
            const result = await asyncQuery(getCarousel)
            res.status(200).send(result)
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    }
}