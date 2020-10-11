const database = require("../database")
const {asyncQuery} = require("../helper/queryHelper")

module.exports = {
    getOrdersData: async(req,res)=>{
        try {
            // get all order data
            const getOrders = `SELECT o.id, o.user_id, o.order_number, o.warehouse_id, o.total_ongkir, o.payment_note, o.upload_date, o.order_date, o.required_date,
            o.send_date, o.done_date, GROUP_CONCAT(p.id) AS product_id, GROUP_CONCAT(p.name) AS name, GROUP_CONCAT(pc.id) AS color_id, GROUP_CONCAT(pc.color) AS color, GROUP_CONCAT(tb2.image) AS image,
            GROUP_CONCAT(od.qty) AS qty, GROUP_CONCAT(od.price_each) AS price_each, os.status, GROUP_CONCAT(pr.rating) AS rating, GROUP_CONCAT(pr.comment) AS comment, w.name as warehouse  FROM orders o
            JOIN order_details od ON o.order_number = od.order_number
            JOIN order_status os ON o.order_status_id = os.id
            JOIN product_color pc ON od.color_id = pc.id
            JOIN warehouse w ON o.warehouse_id = w.id
            JOIN products p ON p.id = od.product_id
            LEFT JOIN product_rating pr ON o.order_number = pr.order_number AND od.product_id = pr.product_id AND od.color_id = pr.color_id
            JOIN (SELECT product_id, image
                              FROM product_images
                              GROUP BY product_id) AS tb2 ON od.product_id = tb2.product_id
            GROUP BY o.order_number ORDER BY o.order_date;`
            const result = await asyncQuery(getOrders)

            const getTotal = `SELECT SUM(price_each * qty) AS total FROM order_details od
            JOIN orders o ON o.order_number = od.order_number
            GROUP BY od.order_number ORDER BY o.order_date;`
            const total = await asyncQuery(getTotal)
            result.forEach((item, index)=>{
                item.product_id = item.product_id.split(",")
                item.name = item.name.split(",")
                item.color = item.color.split(",")
                item.qty = item.qty.split(",")
                item.image = item.image.split(",")
                item.price_each = item.price_each.split(",")
                item.total = total[index].total
                if(item.rating !== null && item.comment !== null) {
                    item.rating = item.rating.split(",")
                    item.comment = item.comment.split(",")
                } 
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
            const getOrders = `SELECT o.id, o.user_id, o.order_number, o.total_ongkir, o.payment_note, o.upload_date, o.order_date, o.required_date,
            o.send_date, o.done_date, GROUP_CONCAT(p.id) AS product_id, GROUP_CONCAT(p.name) AS name, GROUP_CONCAT(pc.id) AS color_id,
            GROUP_CONCAT(pc.color) AS color, GROUP_CONCAT(tb2.image) AS image, GROUP_CONCAT(od.qty) AS qty, GROUP_CONCAT(od.price_each) AS price_each, 
            os.status, GROUP_CONCAT(pr.rating) AS rating, GROUP_CONCAT(pr.comment) AS comment, w.name as warehouse  FROM orders o
            JOIN order_details od ON o.order_number = od.order_number
            JOIN order_status os ON o.order_status_id = os.id
            JOIN product_color pc ON od.color_id = pc.id
            JOIN warehouse w ON o.warehouse_id = w.id
            JOIN products p ON p.id = od.product_id
            LEFT JOIN product_rating pr ON o.order_number = pr.order_number AND od.product_id = pr.product_id AND od.color_id = pr.color_id
            JOIN (SELECT product_id, image
                FROM product_images
                GROUP BY product_id) AS tb2 ON od.product_id = tb2.product_id
            WHERE o.user_id = ${database.escape(Id)} GROUP BY o.order_number ORDER BY o.order_date;`
            const result = await asyncQuery(getOrders)

            const getTotal = `SELECT SUM(price_each * qty) AS total FROM order_details od
            JOIN orders o ON o.order_number = od.order_number
             WHERE o.user_id = ${database.escape(Id)} GROUP BY od.order_number ORDER BY o.order_date;`
            const total = await asyncQuery(getTotal)
            result.forEach((item, index)=>{
                item.product_id = item.product_id.split(",")
                item.name = item.name.split(",")
                item.color_id = item.color_id.split(",")
                item.color = item.color.split(",")
                item.qty = item.qty.split(",")
                item.image = item.image.split(",")
                if(item.rating !== null && item.comment !== null) {
                    item.rating = item.rating.split(",")
                    item.comment = item.comment.split(",")
                } 
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
            const getOrders = `SELECT o.id, o.user_id, o.order_number, o.total_ongkir, o.payment_note, o.upload_date, o.order_date, o.required_date,
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
        // Id warehouse
        const Id = req.params.id
        try {
            // get order per warehouse
            const getOrders = `SELECT o.id, o.user_id, o.order_number, o.total_ongkir, o.payment_note, o.upload_date, o.order_date, o.required_date,
            o.send_date, o.done_date, GROUP_CONCAT(p.id) AS product_id, GROUP_CONCAT(p.name) AS name, GROUP_CONCAT(pc.id) AS color_id, GROUP_CONCAT(pc.color) AS color, 
            GROUP_CONCAT(tb2.image) AS image, GROUP_CONCAT(od.qty) AS qty, GROUP_CONCAT(od.price_each) AS price_each, 
            os.status, GROUP_CONCAT(pr.rating) AS rating, GROUP_CONCAT(pr.comment) AS comment, w.name as warehouse  FROM orders o
            JOIN order_details od ON o.order_number = od.order_number
            JOIN order_status os ON o.order_status_id = os.id
            JOIN product_color pc ON od.color_id = pc.id
            JOIN warehouse w ON o.warehouse_id = w.id
            JOIN products p ON p.id = od.product_id
            LEFT JOIN product_rating pr ON o.order_number = pr.order_number AND od.product_id = pr.product_id AND od.color_id = pr.color_id
            JOIN (SELECT product_id, image
                FROM product_images
                GROUP BY product_id) AS tb2 ON od.product_id = tb2.product_id
            WHERE o.warehouse_id = ${database.escape(Id)} GROUP BY o.order_number ORDER BY o.order_date;`
            const result = await asyncQuery(getOrders)

            const getTotal = `SELECT SUM(price_each * qty) AS total FROM order_details od
            JOIN orders o ON o.order_number = od.order_number
             WHERE o.warehouse_id = ${database.escape(Id)} GROUP BY od.order_number ORDER BY o.order_date;`
            const total = await asyncQuery(getTotal)
            result.forEach((item, index)=>{
                item.name = item.name.split(",")
                item.color = item.color.split(",")
                item.qty = item.qty.split(",")
                item.image = item.image.split(",")
                if(item.rating !== null && item.comment !== null) {
                    item.rating = item.rating.split(",")
                    item.comment = item.comment.split(",")
                } 
                item.price_each = item.price_each.split(",")
                item.total = total[index].total
                })
            res.status(200).send(result) 
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    },
    getOrdersByWarehouseStatus: async(req,res)=>{
        // Id warehouse
        const Id = req.params.id
        const {order_status_id} = req.body
        try {
            // get order per warehouse
            const getOrders = `SELECT o.id, o.user_id, o.order_number, o.total_ongkir, o.payment_note, o.upload_date, o.order_date, o.required_date,
            o.send_date, o.done_date, GROUP_CONCAT(p.id) AS product_id, GROUP_CONCAT(p.name) AS name, GROUP_CONCAT(pc.color) AS color, GROUP_CONCAT(pc.id) AS color_id, 
            GROUP_CONCAT(tb2.image) AS image, GROUP_CONCAT(od.qty) AS qty, GROUP_CONCAT(od.price_each) AS price_each, 
            os.status, GROUP_CONCAT(pr.rating) AS rating, GROUP_CONCAT(pr.comment) AS comment, w.name as warehouse  FROM orders o
            JOIN order_details od ON o.order_number = od.order_number
            JOIN order_status os ON o.order_status_id = os.id
            JOIN product_color pc ON od.color_id = pc.id
            JOIN warehouse w ON o.warehouse_id = w.id
            JOIN products p ON p.id = od.product_id
            LEFT JOIN product_rating pr ON o.order_number = pr.order_number AND od.product_id = pr.product_id AND od.color_id = pr.color_id
            JOIN (SELECT product_id, image
                FROM product_images
                GROUP BY product_id) AS tb2 ON od.product_id = tb2.product_id
            WHERE o.warehouse_id = ${database.escape(Id)}  AND o.order_status_id= ${database.escape(order_status_id)} GROUP BY o.order_number ORDER BY o.order_date;`
            const result = await asyncQuery(getOrders)

            const getTotal = `SELECT SUM(price_each * qty) AS total FROM order_details od
            JOIN orders o ON o.order_number = od.order_number
             WHERE o.warehouse_id = ${database.escape(Id)} GROUP BY od.order_number ORDER BY o.order_date;`
            const total = await asyncQuery(getTotal)
            result.forEach((item, index)=>{
                item.name = item.name.split(",")
                item.color = item.color.split(",")
                item.qty = item.qty.split(",")
                item.image = item.image.split(",")
                if(item.rating !== null && item.comment !== null) {
                    item.rating = item.rating.split(",")
                    item.comment = item.comment.split(",")
                } 
                item.price_each = item.price_each.split(",")
                item.total = total[index].total
                })
            res.status(200).send(result) 
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    },
    // all order -> UNTUK ADMIN
    getOrdersByStatus: async(req,res)=>{
        // id status order 
        const Id = req.params.id
        try {
            // get order per warehouse
            const getOrders = `SELECT o.id, o.user_id, o.order_number, o.total_ongkir, o.payment_note, o.upload_date, o.order_date, o.required_date,
            o.send_date, o.done_date, GROUP_CONCAT(p.id) AS product_id, GROUP_CONCAT(p.name) AS name, GROUP_CONCAT(pc.id) AS color_id, GROUP_CONCAT(pc.color) AS color, 
            GROUP_CONCAT(tb2.image) AS image, GROUP_CONCAT(od.qty) AS qty, GROUP_CONCAT(od.price_each) AS price_each, 
            os.status, GROUP_CONCAT(pr.rating) AS rating, GROUP_CONCAT(pr.comment) AS comment, w.name as warehouse  FROM orders o
            JOIN order_details od ON o.order_number = od.order_number
            JOIN order_status os ON o.order_status_id = os.id
            JOIN product_color pc ON od.color_id = pc.id
            JOIN warehouse w ON o.warehouse_id = w.id
            JOIN products p ON p.id = od.product_id
            LEFT JOIN product_rating pr ON o.order_number = pr.order_number AND od.product_id = pr.product_id AND od.color_id = pr.color_id
            JOIN (SELECT product_id, image FROM product_images
                    GROUP BY product_id) AS tb2 ON od.product_id = tb2.product_id
            WHERE o.order_status_id = ${database.escape(Id)} GROUP BY o.order_number ORDER BY o.order_date;`
            const result = await asyncQuery(getOrders)

            const getTotal = `SELECT SUM(price_each * qty) AS total FROM order_details od
            JOIN orders o ON o.order_number = od.order_number
             WHERE o.order_status_id = ${database.escape(Id)} GROUP BY od.order_number ORDER BY o.order_date;`
            const total = await asyncQuery(getTotal)
            result.forEach((item, index)=>{
                item.name = item.name.split(",")
                item.color = item.color.split(",")
                item.qty = item.qty.split(",")
                item.image = item.image.split(",")
                item.price_each = item.price_each.split(",")
                if(item.rating !== null && item.comment !== null) {
                    item.rating = item.rating.split(",")
                    item.comment = item.comment.split(",")
                } 
                item.total = total[index].total
                })
            res.status(200).send(result) 
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    },
     // order per id -> UNTUK USER
     getUserOrdersByStatus: async(req,res)=>{
        // id status order 
        const Id = req.params.id
        const {order_status_id} = req.body
        try {
            // get order per user id and status
            const getOrders = `SELECT o.id, o.user_id, o.order_number, o.total_ongkir, o.payment_note, o.upload_date, o.order_date, o.required_date,
            o.send_date, o.done_date, GROUP_CONCAT(p.id) AS product_id, GROUP_CONCAT(p.name) AS name, GROUP_CONCAT(pc.color) AS color,  GROUP_CONCAT(pc.id) AS color_id, GROUP_CONCAT(tb2.image) AS image, GROUP_CONCAT(od.qty) AS qty, GROUP_CONCAT(od.price_each) AS price_each, 
            os.status, GROUP_CONCAT(pr.rating) AS rating, GROUP_CONCAT(pr.comment) AS comment, w.name as warehouse  FROM orders o
            JOIN order_details od ON o.order_number = od.order_number
            JOIN order_status os ON o.order_status_id = os.id
            JOIN product_color pc ON od.color_id = pc.id
            JOIN warehouse w ON o.warehouse_id = w.id
            JOIN products p ON p.id = od.product_id
            LEFT JOIN product_rating pr ON o.order_number = pr.order_number AND od.product_id = pr.product_id AND od.color_id = pr.color_id
            JOIN (SELECT product_id, image
                FROM product_images
                GROUP BY product_id) AS tb2 ON od.product_id = tb2.product_id
            WHERE o.user_id = ${database.escape(Id)} AND o.order_status_id= ${database.escape(order_status_id)} GROUP BY o.order_number ORDER BY o.order_date;`
            const result = await asyncQuery(getOrders)

            const getTotal = `SELECT SUM(price_each * qty) AS total FROM order_details od
            JOIN orders o ON o.order_number = od.order_number
             WHERE o.user_id = ${database.escape(Id)} AND o.order_status_id = ${database.escape(order_status_id)} GROUP BY od.order_number ORDER BY o.order_date;`
            const total = await asyncQuery(getTotal)
            result.forEach((item, index)=>{
                item.name = item.name.split(",")
                item.color = item.color.split(",")
                item.qty = item.qty.split(",")
                item.image = item.image.split(",")
                if(item.rating !== null && item.comment !== null) {
                    item.rating = item.rating.split(",")
                    item.comment = item.comment.split(",")
                } 
                item.price_each = item.price_each.split(",")
                item.total = total[index].total
                })
            res.status(200).send(result) 
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    },
}