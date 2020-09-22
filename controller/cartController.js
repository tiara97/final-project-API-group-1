const database = require('../database')
const {asyncQuery} = require('../helpers/queryHelp')

module.exports = {
    getCart: async (req, res) => {
        const id = parseInt(req.params.id)
        try {
            // get orderNumber from orders table
            const getOrderNumber = `SELECT * FROM orders WHERE user_id = ${id} AND order_status_id = 1`
            const orderNumber = await asyncQuery(getOrderNumber)

            // check item in cart
            if(orderNumber.length === 0) return res.status(200).send(orderNumber)

            // get cart data from order_details
            const getCart = `SELECT od.id, o.user_id, o.order_number, o.warehouse_id, o.order_date, o.required_date, o.send_date, o.done_date, od.product_id, od.color_id, p.name, pc.color, od.qty, od.price_each FROM orders o
                        JOIN order_details od ON o.order_number = od.order_number
                        JOIN products p ON od.product_id = p.id
                        JOIN product_color pc ON od.color_id = pc.id 
                        WHERE o.order_number = ${orderNumber[0].order_number}`
            const cart = await asyncQuery(getCart)



            const totalPrice = `SELECT SUM(price_each * qty) AS total_price FROM order_details
                                WHERE order_number = ${orderNumber[0].order_number}`
            const price = await asyncQuery(totalPrice)
            // send response
            res.status(200).send({cart, total:price[0]})
        } catch (error) {
            // send error
            console.log(error)
            res.status(500).send(error)
        }
    },
    addToCart: async (req, res) => {
        const {
            user_id,
            product_id, 
            color_id, 
            qty, 
            price_each,
            weight,
        } = req.body

        try {
            // check product in our database
            const check = `SELECT * FROM product_stock ps
                        JOIN products p ON p.id = ps.product_id
                        WHERE product_id = ${product_id} AND color_id = ${color_id}`
            const resultCheck = await asyncQuery(check)

            // send response if product doesn't exists
            if(resultCheck.length === 0) return res.status(422).send(`Your input can't process in our database. Check your input product, size, or color.`)

            // check quantity vs stock
            let stock_available = 0
            resultCheck.forEach(item => stock_available += item.stock_available)
            if(qty > stock_available){
                return res.status(400).send(`Stok untuk produk ${resultCheck[0].name} hanya tersedia ${stock_available}`)
            }

            // check orderNumber in our database
            const orderNumberCart = `SELECT order_number FROM orders WHERE user_id = ${user_id} AND order_status_id = 1`
            const resOrderNumberCart = await asyncQuery(orderNumberCart)

            // create order number
            let orderNum
            if(resOrderNumberCart.length === 0){
                const orderFix = `SELECT order_number FROM orders WHERE user_id = ${user_id} AND order_status_id != 1`
                const resOrderFix = await asyncQuery(orderFix)

                resOrderFix.length !== 0 ? orderNum = parseInt(resOrderFix[resOrderFix.length-1].order_number) + 1 : orderNum = `${userId}0001`

                // input order data in orders
                const orders = `INSERT INTO orders (user_id, order_number, order_status_id) 
                            VALUES (${user_id}, '${orderNum}', 1)`
                await asyncQuery(orders)
                
            } else {
                orderNum = resOrderNumberCart[0].order_number
            }

            // input product in order_details
            const addToCart = `INSERT INTO order_details (order_number, product_id, color_id, qty, price_each, weight) 
                            VALUES (${orderNum}, ${product_id}, ${color_id}, ${qty}, ${price_each}, ${weight})`
            const resAddtocart = await asyncQuery(addToCart)

            // send response
            res.status(200).send(resAddtocart)
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    },
    editQtyInCart: async (req, res) => {
       const { user_id, qty, color_id } = req.body

        // id from table order_details
       const id = parseInt(req.params.id)
        try {
            const checkOrder = `SELECT order_number FROM orders WHERE user_id = ${user_id} AND order_status_id = 1`
            const resCheckOrder = await asyncQuery(checkOrder)

            // check orderNumber in table orders
            if (resCheckOrder.length === 0) return res.status(422).send(`There is something wrong. You can't edit this product from cart`)

            // check qty vs stock
            const getProductID = `SELECT product_id FROM order_details WHERE id = ${database.escape(id)}`
            const ID = await asyncQuery(getProductID)

            // check product in our database
            const check = `SELECT * FROM product_stock ps
                        JOIN products p ON p.id = ps.product_id
                        WHERE product_id = ${ID[0].product_id} AND color_id = ${color_id}`
            const resultCheck = await asyncQuery(check)

            // send response if product doesn't exists
            if(resultCheck.length === 0) return res.status(422).send(`Your input can't process in our database. Check your input product, size, or color.`)

            // check quantity vs stock
            let stock_available = 0
            resultCheck.forEach(item => stock_available += item.stock_available)
            if(qty > stock_available){
                return res.status(400).send(`Stok untuk produk ${resultCheck[0].name} hanya tersedia ${stock_available}`)
            }
            // update product from order_details
            const editProduct = `UPDATE order_details SET qty = ${qty} WHERE id = ${id}`
            const resEdit = await asyncQuery(editProduct)

            // send response
            res.status(200).send(resEdit)
        } catch (error) {
            // send error
            console.log(error)
            res.status(500).send(error)
        }
    },
    deleteCart: async (req, res) => {
        // id from table order_details
        const id = parseInt(req.params.id)
         try {
             // check orderNumber di tabel orders
             const checkOrder = `SELECT * FROM order_details WHERE id = ${id}`
             const resCheckOrder = await asyncQuery(checkOrder)
            
            //  send response if cart doesnt exists
             if (resCheckOrder.length === 0) return res.status(422).send(`There is something wrong. You can't delete this product from cart`)
 
             // delete product from order_details
             const deleteProduct = `DELETE FROM order_details WHERE id = ${id}`
             const resDelete = await asyncQuery(deleteProduct)
 
            //  send response
             res.status(200).send(resDelete)
         } catch (error) {
            //  send error
             console.log(error)
             res.status(500).send(error)
         }
    },
    updateWarehouseID: async (req,res)=>{
        const {order_number} = req.body
        const id = parseInt(req.params.id)
        try {
            // get latitude and longitude from data address
            const getAddress = `SELECT latitude, longitude FROM user_address WHERE id = ${database.escape(id)}`
            const latlong = await asyncQuery(getAddress)

            // get data warehouse
            const getWarehouse = `SELECT * FROM warehouse`
            const warehouse = await asyncQuery(getWarehouse)

            // compare all warehouse distance from user address using haversine method
            let R = 6371e3
            let φ1 = 0
            let φ2 = 0
            let Δφ = 0
            let Δλ = 0
            let a = 0
            let c =0
            let d = 0
            let lat1 = latlong[0].latitude
            let lat2 = 0
            let lon1 = latlong[0].longitude
            let lon2 = 0
            let jarak = []
            let wareHouseID = null
            let distance = 0

            warehouse.map((item)=>{
                return(
                    lat2 = item.latitude,
                    lon2 = item.longitude,
                    φ1 =lat1 * Math.PI/180, // φ, λ in radians
                    φ2 = lat2 * Math.PI/180,
                    Δφ = (lat2-lat1) * Math.PI/180,
                    Δλ = (lon2-lon1) * Math.PI/180,
                    a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                            Math.cos(φ1) * Math.cos(φ2) *
                            Math.sin(Δλ/2) * Math.sin(Δλ/2),
                    c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)),
                    d = R * c, // in metres
                    jarak.push(d),
                    d === Math.min(...jarak)? (warehouseID = item.id, distance = d ): null
                    )
                })
            console.log("warehouse id : ",warehouseID)

            // Update warehouse id on table orders
            const updateOrders = `UPDATE orders SET warehouse_id = ${database.escape(warehouseID)},
                                distance = ${database.escape(distance)}
                                WHERE order_number = ${database.escape(order_number)}`
            const result = await asyncQuery(updateOrders)

            res.status(200).send(result)
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    },
    getOngkir: async(req,res)=>{
        const {order_number} = req.body
        try {
            const getTotalWeight = `SELECT SUM(weight * qty) AS total_weight 
                                    FROM order_details WHERE order_number = ${database.escape(order_number)}`
            const totalWeight = await asyncQuery(getTotalWeight)
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    }
}