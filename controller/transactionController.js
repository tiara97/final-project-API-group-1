const database = require("../database")
const { asyncQuery } = require('../helper/queryHelper')

var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
var today = (new Date(Date.now() - tzoffset)).toISOString().slice(0, 19).replace('T', ' ');
var tomorrow = new Date(Date.now() - tzoffset)

module.exports = {
    // user checkout order
    checkoutConfirmation: async (req, res) => {
        const order = parseInt(req.params.order)
        // get tomorrow date for payment time limit
        tomorrow.setDate(tomorrow.getDate() + 1)
        var reqDate = tomorrow.toISOString().slice(0, 19).replace('T', ' ')
        try {
            const query = `UPDATE orders SET order_status_id = 2, order_date = '${today}', required_date='${reqDate}' WHERE order_number = ${database.escape(order)};`
            const result = await asyncQuery(query)
            res.status(200).send(result)
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    },
    // user upload foto bukti pembayaran
    paymentUpload: async (req, res) => {
        const order = parseInt(req.params.order)
        console.log(req.file)
        if (req.file === undefined) {
            return res.status(400).send('No image')
        }
        try {
            const query = `UPDATE orders SET payment_note = 'receipt/${req.file.filename}', upload_date='${today}' WHERE order_number = ${database.escape(order)};`
            const result = await asyncQuery(query)
            res.status(200).send(result)
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    },
    // admin konfirmasi struk pembayaran
    paymentConfirmation: async (req, res) => {
        const order = parseInt(req.params.order)
        try {
            const query = `UPDATE orders SET order_status_id = 3 WHERE order_number = ${database.escape(order)};`
            const result = await asyncQuery(query)
            res.status(200).send(result)
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    },
    // admin send order to user
    sendConfirmation: async (req, res) => {
        const order = parseInt(req.params.order)
        const { wh_id } = req.body
        try {
            // const query = `UPDATE orders SET order_status_id = 4, send_date = '${today}' WHERE order_number = ${database.escape(order)};`
            // const result = await asyncQuery(query)
            // res.status(200).send(result)
            const query = `UPDATE orders SET order_status_id = 4, send_date = '${today}' WHERE order_number = ${database.escape(order)};`
            const changeStatus = await asyncQuery(query)

            const getData = `SELECT product_id, color_id, qty FROM order_details WHERE order_number = ${database.escape(order)};`
            const data = await asyncQuery(getData)
            data.map(async (item, ind) => {
                const getStock = `SELECT * FROM product_stock WHERE product_id = ${item.product_id} AND color_id = ${item.color_id} AND warehouse_id = ${wh_id};`
                const stock = await asyncQuery(getStock)
                let stock_ordered = stock[0].stock_ordered
                console.log(stock_ordered)
                const minusStock = `UPDATE product_stock SET stock_ordered = ${stock_ordered - item.qty} WHERE product_id = ${item.product_id} AND color_id = ${item.color_id} AND warehouse_id = ${wh_id};`
                const stockNew = await asyncQuery(minusStock)
            })
            res.status(200).send(changeStatus)
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    },
    // user received package, and order is done
    doneConfirmation: async (req, res) => {
        const order = parseInt(req.params.order)
        try {
            const query = `UPDATE orders SET order_status_id = 5, done_date = '${today}' WHERE order_number = ${database.escape(order)};`
            const result = await asyncQuery(query)
            res.status(200).send(result)
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    },
    // user cancel order
    cancelConfirmation: async (req, res) => {
        const order = parseInt(req.params.order)
        const { wh_id } = req.body
        try {
            const query = `UPDATE orders SET order_status_id = 6 WHERE order_number = ${database.escape(order)};`
            const changeStatus = await asyncQuery(query)
            // const getData = `SELECT GROUP_CONCAT(product_id) AS product_id, GROUP_CONCAT(color_id) AS color, GROUP_CONCAT(qty) AS qty  FROM db_finalproject.order_details WHERE order_number = ${database.escape(order)};`
            const getData = `SELECT product_id, color_id, qty FROM order_details WHERE order_number = ${database.escape(order)};`
            const data = await asyncQuery(getData)
            data.map(async (item, ind) => {
                const getStock = `SELECT * FROM product_stock WHERE product_id = ${item.product_id} AND color_id = ${item.color_id} AND warehouse_id = ${wh_id};`
                const stock = await asyncQuery(getStock)
                let stock_available = stock[0].stock_available
                let stock_ordered = stock[0].stock_ordered
                console.log(stock_available, stock_ordered)
                const minusStock = `UPDATE product_stock SET stock_available = ${stock_available + item.qty}, stock_ordered = ${stock_ordered - item.qty} WHERE product_id = ${item.product_id} AND color_id = ${item.color_id} AND warehouse_id = ${wh_id};`
                const stockNew = await asyncQuery(minusStock)
            })
            // console.log(stock)
            // data.forEach((item, index) => {
            //     item.product_id = item.product_id.split(",")
            //     item.color = item.color.split(",")
            //     item.qty = item.qty.split(",")
            // })
            // const getStock = `SELECT * FROM product_stock WHERE product_id = 1 AND color_id = 1 AND warehouse_id = 1;`
            // const stock = await asyncQuery(getStock)
            // data[0].product_id.map((item, ind) => {
            //     const getStock = `SELECT * FROM product_stock WHERE product_id = ${item} AND color_id = 1 AND warehouse_id = 1;`
            //     const stock = await asyncQuery(getStock)
            // })

            // const minusStock = `UPDATE product_stock SET stock_available = '18', stock_ordered = '2' WHERE product_id = 1 AND color_id = 1 AND warehouse_id = ${database.escape(data)};`
            // const getStock = `SELECT * FROM product_stock WHERE product_id = 1 AND color_id = 1 AND warehouse_id = 1;`
            // const stock = await asyncQuery(getStock)
            res.status(200).send(changeStatus)
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    },
    // reject order because payment note is rejected
    rejectConfirmation: async (req, res) => {
        const order = parseInt(req.params.order)
        const { wh_id } = req.body
        try {
            const query = `UPDATE orders SET order_status_id = 7 WHERE order_number = ${database.escape(order)};`
            const changeStatus = await asyncQuery(query)

            const getData = `SELECT product_id, color_id, qty FROM order_details WHERE order_number = ${database.escape(order)};`
            const data = await asyncQuery(getData)
            data.map(async (item, ind) => {
                const getStock = `SELECT * FROM product_stock WHERE product_id = ${item.product_id} AND color_id = ${item.color_id} AND warehouse_id = ${wh_id};`
                const stock = await asyncQuery(getStock)
                let stock_available = stock[0].stock_available
                let stock_ordered = stock[0].stock_ordered
                console.log(stock_available, stock_ordered)
                const minusStock = `UPDATE product_stock SET stock_available = ${stock_available + item.qty}, stock_ordered = ${stock_ordered - item.qty} WHERE product_id = ${item.product_id} AND color_id = ${item.color_id} AND warehouse_id = ${wh_id};`
                const stockNew = await asyncQuery(minusStock)
            })
            res.status(200).send(changeStatus)
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    },
}