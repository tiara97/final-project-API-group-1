const database = require("../database")
const {asyncQuery} = require("../helper/queryHelper")

module.exports = {
    getOrdersData: async(req,res)=>{
        const Id = req.params.Id
        try {
            const getOrders = `SELECT o.id, o.user_id, o.order_number, o.date, od.product_id, od.color_id, od.qty, od.price_each, os.status 
                                FROM orders o
                                JOIN order_details od ON o.order_number = od.order_number
                                JOIN order_status os ON o.order_status_id = os.status
                                WHERE o.user_id = ${database.escape(Id)};`
            const result = await asyncQuery(getOrders)
            res.status(200).send(result) 
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    }
}