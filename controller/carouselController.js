const database = require("../database")
const { asyncQuery } = require("../helper/queryHelper")

module.exports={
    getCarouselData: async(req,res)=>{
        try {
            // get carousel
            const getCarousel = `SELECT * FROM carousel`
            const result = await asyncQuery(getCarousel)
            res.status(200).send(result)
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    }
}