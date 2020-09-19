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
            const query = `UPDATE orders SET payment_note = 'receipt/${req.file.filename}' WHERE order_number = ${database.escape(order)};`
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
        try {
            const query = `UPDATE orders SET order_status_id = 4, send_date = '${today}' WHERE order_number = ${database.escape(order)};`
            const result = await asyncQuery(query)
            res.status(200).send(result)
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
    // user cancel order or exceed payment time limit
    cancelConfirmation: async (req, res) => {
        const order = parseInt(req.params.order)
        try {
            const query = `UPDATE orders SET order_status_id = 6 WHERE order_number = ${database.escape(order)};`
            const result = await asyncQuery(query)
            res.status(200).send(result)
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    },
}