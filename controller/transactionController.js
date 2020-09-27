const database = require("../database")
const { asyncQuery, getClosestWarehouse, generateQuery } = require('../helper/queryHelper')

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
            
            // get product from cart and product stock
            const check = `select od.product_id, od.color_id, o.warehouse_id, od.qty, ps.stock_available, 
                        ps.stock_ordered, ps.warehouse_id as wh
                        from orders o 
                        join order_details od on o.order_number = od.order_number
                        JOIN product_stock ps ON ps.warehouse_id = o.warehouse_id
                        where o.order_number = ${order} AND od.product_id = ps.product_id AND od.color_id = ps.color_id;`
            const stock =  await asyncQuery(check)
            
            // get warhouse
            const getWarehouse = `SELECT id, latitude, longitude FROM warehouse`
            const warehouse = await asyncQuery(getWarehouse)

            const body ={
                latitude: warehouse[stock[0].warehouse_id - 1].latitude,
                longitude: warehouse[stock[0].warehouse_id - 1].longitude,
                warehouse: warehouse
            }
            const warehouseData = getClosestWarehouse(body).result 
           
            console.log("stock : ",stock)
            stock.forEach(async (item)=>{
                console.log("product : ", item.product_id)
                try {
                    // check stock in warehouse order
                    if(item.qty > item.stock_available){
                        console.log("stock kurang")
                        let min = item.qty - item.stock_available
                        // search from other warehouse
                        looping : for(let i = 0; i< warehouseData.length; i++){
                            console.log("min :", min)
                            
                            if(min === 0) break looping;
                            const checkStock = `SELECT * FROM product_stock WHERE warehouse_id = ${warehouseData[i].id} 
                            AND product_id = ${item.product_id} AND color_id = ${item.color_id}`
                            const tempStock = await asyncQuery(checkStock)
                            console.log("tempstock : ", tempStock)
                            
                            // update stock in warehouse
                            const updateStockC = `UPDATE product_stock SET stock_available = ${tempStock[0].stock_available < min? 0 : tempStock[0].stock_available - min} 
                                                    WHERE warehouse_id = ${warehouseData[i].id} 
                                                    AND product_id = ${item.product_id} AND color_id = ${item.color_id}`
                            console.log("update c :",updateStockC)
                            await asyncQuery(updateStockC)
                            // update min
                            min = tempStock[0].stock_available < min? min - tempStock[0].stock_available : 0
                    }
                }
                console.log("stock ada")
                    // update stock in warehouse id order
                    const updateStockA = `UPDATE product_stock SET stock_available = ${item.qty > item.stock_available? 0 : item.stock_available - item.qty},
                                            stock_ordered = ${item.stock_ordered + item.qty} WHERE warehouse_id = ${item.warehouse_id} 
                                            AND product_id = ${item.product_id} AND color_id = ${item.color_id}`
                    console.log("update a :",updateStockA)
                    await asyncQuery(updateStockA)
                } catch (error) {
                    console.log(error)   
                }
            })
            
            // update status order
            const query = `UPDATE orders SET order_status_id = 2, order_date = '${today}', required_date='${reqDate}' WHERE order_number = ${database.escape(order)};`
            const result = await asyncQuery(query)
            res.status(200).send(stock)
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
    // user cancel order
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
    // reject order because payment note is rejected
    rejectConfirmation: async (req, res) => {
        const order = parseInt(req.params.order)
        try {
            const query = `UPDATE orders SET order_status_id = 7 WHERE order_number = ${database.escape(order)};`
            const result = await asyncQuery(query)
            res.status(200).send(result)
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    },
}