const database = require("../database")
const {asyncQuery, generateQuery} = require("../helper/queryHelper")

module.exports = {
    getRatingAll : async(req,res) => {
        try {
            
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    },
    getRatingByUser : async(req,res) => {
        // id user
        const Id = parseInt(req.params.id)
        try {
            const query = `SELECT o.user_id, o.order_number, od.product_id, od.color_id, pr.rating, pr.comment FROM orders o
            JOIN order_details od ON o.order_number = od.order_number
            LEFT JOIN product_rating pr ON od.product_id = pr.product_id AND od.color_id = pr.color_id
            WHERE o.user_id = ${database.escape(Id)} AND o.order_status_id =5;`
            const result = await asyncQuery(query)
            res.status(200).send(result)
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    },
    getRatingByProduct : async(req,res) => {
        // id product
        const Id = parseInt(req.params.id)
        try {
            
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    },
    addRating : async(req,res) => {
        const { order_number, user_id, product_id, color_id, rate, comment } = req.body
        try {
            const query = `UPDATE product_rating SET rating = ${database.escape(rate)}, comment =${database.escape(comment)} 
            WHERE order_number =  ${database.escape(order_number)} AND product_id = ${database.escape(product_id)} AND color_id = ${database.escape(color_id)};`
            const result = await asyncQuery(query)
            res.status(200).send(result)
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    },
}