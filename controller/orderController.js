const database = require("../database")
const {asyncQuery} = require("../helper/queryHelper")

module.exports = {
    getOrdersData: async(req,res)=>{
<<<<<<< HEAD
        const Id = req.params.Id
        try {
            const getOrders = `SELECT o.id, o.user_id, o.order_number, o.date, od.product_id, od.color_id, od.qty, od.price_each, os.status 
                                FROM orders o
                                JOIN order_details od ON o.order_number = od.order_number
                                JOIN order_status os ON o.order_status_id = os.status
                                WHERE o.user_id = ${database.escape(Id)};`
=======
        try {
            // get all order data
            const getOrders = `SELECT o.id, o.user_id, o.order_number, o.order_date, o.required_date,
                                o.send_date, o.received_date , od.product_id, od.color_id, od.qty, 
                                od.price_each, os.status, w.name as warehouse  FROM orders o
                                JOIN order_details od ON o.order_number = od.order_number
                                JOIN order_status os ON o.order_status_id = os.id
                                JOIN warehouse w ON o.warehouse_id = w.id`
>>>>>>> 8e0f3a20723367c31c58c45e31b02db6531c5496
            const result = await asyncQuery(getOrders)
            res.status(200).send(result) 
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
<<<<<<< HEAD
    }
=======
    },
    getOrdersById: async(req,res)=>{
        const Id = req.params.id
        try {
            // get order per user id
            const getOrders = `SELECT o.id, o.user_id, o.order_number, o.order_date, o.required_date,
                                o.send_date, o.received_date , od.product_id, od.color_id, od.qty, 
                                od.price_each, os.status, w.name as warehouse  FROM orders o
                                JOIN order_details od ON o.order_number = od.order_number
                                JOIN order_status os ON o.order_status_id = os.id
                                JOIN warehouse w ON o.warehouse_id = w.id
                                WHERE o.user_id = ${database.escape(Id)}`
            const result = await asyncQuery(getOrders)
            res.status(200).send(result) 
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    },
    getOrdersByWarehouse: async(req,res)=>{
        const Id = req.params.id
        try {
            // get order per warehouse
            const getOrders = `SELECT o.id, o.user_id, o.order_number, o.order_date, o.required_date,
                                o.send_date, o.received_date , od.product_id, od.color_id, od.qty, 
                                od.price_each, os.status, w.name as warehouse  FROM orders o
                                JOIN order_details od ON o.order_number = od.order_number
                                JOIN order_status os ON o.order_status_id = os.id
                                JOIN warehouse w ON o.warehouse_id = w.id
                                WHERE w.id = ${database.escape(Id)}`
            const result = await asyncQuery(getOrders)
            res.status(200).send(result) 
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    },
>>>>>>> 8e0f3a20723367c31c58c45e31b02db6531c5496
}