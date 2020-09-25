const database = require("../database")
const {asyncQuery} = require("../helper/queryHelper")

module.exports = {
    getOrdersData: async(req,res)=>{
        try {
            // get all order data
            const getOrders = `SELECT o.id, o.user_id, o.order_number, o.order_date, o.required_date,
            o.send_date, o.done_date , GROUP_CONCAT(p.name) AS name, GROUP_CONCAT(pc.color) AS color, GROUP_CONCAT(tb2.image) AS image,
            GROUP_CONCAT(od.qty) AS qty, GROUP_CONCAT(od.price_each) AS price_each, os.status, w.name as warehouse  FROM orders o
            JOIN order_details od ON o.order_number = od.order_number
            JOIN order_status os ON o.order_status_id = os.id
            JOIN product_color pc ON od.color_id = pc.id
            JOIN (SELECT product_images.product_id AS product_id,GROUP_CONCAT(product_images.image SEPARATOR ',') AS image
                FROM product_images GROUP BY product_images.product_id) tb2 ON od.product_id = tb2.product_id
            JOIN warehouse w ON o.warehouse_id = w.id
            JOIN products p ON p.id = od.product_id
            GROUP BY o.order_number;`
            const result = await asyncQuery(getOrders)

            const getTotal = `SELECT SUM(price_each * qty) AS total FROM order_details GROUP BY ORDER_NUMBER`
            const total = await asyncQuery(getTotal)
            result.forEach((item, index)=>{
                item.name = item.name.split(",")
                item.color = item.color.split(",")
                item.qty = item.qty.split(",")
                item.image = item.image.split(",")
                item.price_each = item.price_each.split(",")
                item.total = total[index].total
            })

            res.status(200).send(result) 
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    },
    getOrdersById: async(req,res)=>{
        const Id = req.params.id
        try {
            // get order per user id
            const getOrders = `SELECT o.id, o.user_id, o.order_number, o.order_date, o.required_date,
            o.send_date, o.done_date , GROUP_CONCAT(p.name) AS name, GROUP_CONCAT(pc.color) AS color, 
            GROUP_CONCAT(tb2.image) AS image, GROUP_CONCAT(od.qty) AS qty, GROUP_CONCAT(od.price_each) AS price_each, 
            os.status, w.name as warehouse  FROM orders o
            JOIN order_details od ON o.order_number = od.order_number
            JOIN order_status os ON o.order_status_id = os.id
            JOIN product_color pc ON od.color_id = pc.id
            JOIN warehouse w ON o.warehouse_id = w.id
            JOIN products p ON p.id = od.product_id
            JOIN (SELECT product_id, image
                                          FROM product_images
                                          GROUP BY product_id) AS tb2 ON od.product_id = tb2.product_id
            WHERE o.user_id = ${database.escape(Id)} GROUP BY o.order_number;`
            const result = await asyncQuery(getOrders)

            const getTotal = `SELECT SUM(price_each * qty) AS total FROM order_details od
            JOIN orders o ON o.order_number = od.order_number
             WHERE o.user_id = ${database.escape(Id)} GROUP BY od.order_number;`
            const total = await asyncQuery(getTotal)
            result.forEach((item, index)=>{
                item.name = item.name.split(",")
                item.color = item.color.split(",")
                item.qty = item.qty.split(",")
                item.image = item.image.split(",")
                item.price_each = item.price_each.split(",")
                item.total = total[index].total
                })
            res.status(200).send(result) 
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    },
    getOrdersByNumber: async(req,res)=>{
        const order_number = req.params.order_number
        try {
            // get order per user id
            const getOrders = `SELECT o.id, o.user_id, o.order_number, o.order_date, o.required_date,
            o.send_date, o.done_date , GROUP_CONCAT(p.name) AS name, GROUP_CONCAT(pc.color) AS color, GROUP_CONCAT(pi.image) AS image,
            GROUP_CONCAT(od.qty) AS qty, GROUP_CONCAT(od.price_each) AS price_each, os.status, w.name as warehouse  FROM orders o
            JOIN order_details od ON o.order_number = od.order_number
            JOIN order_status os ON o.order_status_id = os.id
            JOIN warehouse w ON o.warehouse_id = w.id
            JOIN product_images pi ON od.product_id = pi.product_id
            JOIN product_color pc ON od.color_id = pc.id
            JOIN products p ON p.id = od.product_id
            WHERE o.order_number = ${order_number}
            GROUP BY o.order_number;`
            const result = await asyncQuery(getOrders)

            result.forEach((item)=>{
                item.name = item.name.split(",")
                item.color = item.color.split(",")
                item.qty = item.qty.split(",")
                item.image = item.image.split(",")
                item.price_each = item.price_each.split(",")
            })

            const getTotal = `SELECT SUM(price_each * qty) AS total FROM order_details
                                WHERE order_number = ${order_number}`
            const total = await asyncQuery(getTotal)
            result[0].total = total[0].total
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
            o.send_date, o.done_date , od.product_id, pc.color, od.qty, 
            od.price_each, os.status, w.name as warehouse  FROM orders o
            JOIN order_details od ON o.order_number = od.order_number
            JOIN order_status os ON o.order_status_id = os.id
            JOIN product_color pc ON od.color_id = pc.id
            JOIN warehouse w ON o.warehouse_id = w.id
            WHERE w.id = ${database.escape(Id)};`
            const result = await asyncQuery(getOrders)
            res.status(200).send(result) 
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    },
}