const database = require('../database')
const {asyncQuery, getClosestWarehouse} = require('../helper/queryHelper')

module.exports = {
    getCart: async (req, res) => {
        const id = parseInt(req.params.id)
        try {
            // get orderNumber from orders table
            const getOrderNumber = `SELECT * FROM orders WHERE user_id = ${id} AND order_status_id = 1`
            const orderNumber = await asyncQuery(getOrderNumber)

            console.log('orderNumber: ', orderNumber)
            // check item in cart
            if(orderNumber.length === 0) return res.status(200).send(orderNumber)

            // get cart data from order_details
            const getCart = `SELECT od.id, o.user_id, o.order_number, o.warehouse_id, 
                        o.total_ongkir, o.order_date, o.required_date, o.send_date, o.done_date, 
                        od.product_id, od.color_id, p.name, pc.color, od.qty, od.price_each, tb2.image FROM orders o
                        JOIN order_details od ON o.order_number = od.order_number
                        JOIN products p ON od.product_id = p.id
                        JOIN product_color pc ON od.color_id = pc.id 
                        JOIN (SELECT product_id, image
                            FROM product_images
                            GROUP BY product_id) AS tb2 ON od.product_id = tb2.product_id
                        WHERE o.order_number = ${orderNumber[0].order_number}`
            const cart = await asyncQuery(getCart)
            
            let error =  null
            // check stock barang
            cart.forEach(async (item)=>{
                try {        
                    const checkProduct = `SELECT SUM(stock_available) as stock_available FROM product_stock WHERE product_id = ${item.product_id} AND color_id = ${item.color_id}`
                    const resultCheck = await asyncQuery(checkProduct)
                    if(item.qty > resultCheck[0].stock_available){
                        item.error = `Stock ${item.name} hanya tersedia ${resultCheck[0].stock_available}`
                        error= item.error
                    }else if(resultCheck[0].stock_available === 0){
                        item.error = "Barang tidak tersedia"
                        error= item.error
                    }
                } catch (error) {
                    console.log(error)
                }
            })

            const totalPrice = `SELECT SUM(price_each * qty) AS total_price FROM order_details
                                WHERE order_number = ${orderNumber[0].order_number}`
            const price = await asyncQuery(totalPrice)
            // send response
            res.status(200).send({cart, total:price[0], error})
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

        // check color input
        if(!color_id){
            return res.status(422).send(`Anda belum memilih warna produk!`)
        }

        // check qty input
        if(qty < 1){
            return res.status(422).send(`Input jumlah tidak boleh kurang dari 1!`)
        }

        try {
            // check product in our database
            const check = `SELECT ps.product_id, p.name, SUM(stock_available) as stock_available FROM product_stock ps
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
            
            // check quantity vs quantity user in cart
            const checkCart = `SELECT od.product_id, SUM(od.qty) AS total_qty FROM orders o
                            JOIN order_details od ON o.order_number = od.order_number
                            WHERE o.order_status_id = 1 AND od.product_id = ${product_id} AND o.user_id = ${user_id}
                            GROUP BY od.product_id;`
            const resCheckCart = await asyncQuery(checkCart)

            if(resCheckCart.length > 0 && qty > (stock_available - resCheckCart[0].total_qty)){
                return res.status(400).send(`Stok untuk produk ${resultCheck[0].name} hanya tersedia ${stock_available - resCheckCart[0].total_qty}`)
            }
                            

            // check orderNumber in our database
            const orderNumberCart = `SELECT order_number FROM orders WHERE user_id = ${user_id} AND order_status_id = 1`
            const resOrderNumberCart = await asyncQuery(orderNumberCart)
            console.log('resOrderNumberCart: ', resOrderNumberCart)

            // create order number
            let orderNum
            console.log('orderNum: ', orderNum)
            if(resOrderNumberCart.length === 0){
                const orderFix = `SELECT order_number FROM orders WHERE user_id = ${user_id} AND order_status_id != 1`
                const resOrderFix = await asyncQuery(orderFix)

                resOrderFix.length !== 0 ? orderNum = parseInt(resOrderFix[resOrderFix.length-1].order_number) + 1 : orderNum = `${user_id}0001`

                // input order data in orders
                const orders = `INSERT INTO orders (user_id, order_number, order_status_id) 
                            VALUES (${user_id}, '${orderNum}', 1)`
                await asyncQuery(orders)
                console.log('orderNum1: ', orderNum)
            } else {
                orderNum = resOrderNumberCart[0].order_number
                console.log('orderNum2: ', orderNum)
            }
            // check product in order_details
            const checkProductID = `SELECT * FROM order_details WHERE order_number = ${orderNum} AND product_id = ${product_id} AND color_id = ${color_id}`
            const resultCheckProd = await asyncQuery(checkProductID)


            
            if(resultCheckProd.length  === 0){
                // check quantity vs stock
                if(qty > resultCheck[0].stock_available){
                    return res.status(400).send(`Stok untuk produk ${resultCheck[0].name} hanya tersedia ${resultCheck[0].stock_available}`)
                }
                // input product in order_details
                const addToCart = `INSERT INTO order_details (order_number, product_id, color_id, qty, price_each, weight) 
                VALUES (${orderNum}, ${product_id}, ${color_id}, ${qty}, ${price_each}, ${weight})`
                const resAddtocart = await asyncQuery(addToCart)
            } else{
                // check quantity vs stock
                if((resultCheckProd[0].qty + qty) >  resultCheck[0].stock_available){
                    return res.status(400).send(`Stok untuk produk ${resultCheck[0].name} hanya tersedia ${ resultCheck[0].stock_available}. 
                    Anda sudah memiliki ${resultCheckProd[0].qty} di keranjang`)
                }
                // + qty product_id on order_details
                const addToCart = `UPDATE order_details  SET qty = ${resultCheckProd[0].qty + qty}
                                    WHERE order_number = ${orderNum} AND product_id = ${product_id} AND color_id = ${color_id}`
                const resAddtocart = await asyncQuery(addToCart)
            }

            console.log(`orderNum: ${orderNum}, user_id: ${user_id}, product_id: ${product_id}, color_id: ${color_id}, qty: ${qty}, price_each: ${price_each}, weight:${weight}`)
            // send response
            res.status(200).send(resultCheckProd)
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
            const check = `SELECT ps.product_id, p.name, SUM(stock_available) AS stock_available FROM product_stock ps
                        JOIN products p ON p.id = ps.product_id
                        WHERE product_id = ${ID[0].product_id} AND color_id = ${color_id}`
            const resultCheck = await asyncQuery(check)

            // send response if product doesn't exists
            if(resultCheck.length === 0) return res.status(422).send(`Your input can't process in our database. Check your input product, size, or color.`)

            // check quantity vs stock
            if(qty > resultCheck[0].stock_available){
                return res.status(400).send(`Stok untuk produk ${resultCheck[0].name} hanya tersedia ${resultCheck[0].stock_available}`)
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

            const body ={
                latitude: latlong[0].latitude,
                longitude: latlong[0].longitude,
                warehouse: warehouse
            }
            let wareHouseID =  getClosestWarehouse(body).nearest
          
            // Update warehouse id on table orders
            const updateOrders = `UPDATE orders SET warehouse_id = ${database.escape(wareHouseID.id)},
                                distance = ${database.escape(wareHouseID.distance)}
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
            // get total weight on order number
            const getTotalWeight = `SELECT SUM(weight * qty) AS total_weight 
                                    FROM order_details WHERE order_number = ${database.escape(order_number)}`
            const totalWeight = await asyncQuery(getTotalWeight)

            // get delivery fee table
            const getMaxWeight = `SELECT * FROM delivery_fee`
            const maxWeight = await asyncQuery(getMaxWeight)

            // compare total weight with weight on delivery table
            let fee = 0

            if(totalWeight[0].total_weight <= maxWeight[0].weight){
                fee = parseInt(maxWeight[0].price)
            } else if(totalWeight[0].total_weight > maxWeight[0].weight && totalWeight[0].total_weight <= maxWeight[1].weight){
                fee = parseInt(maxWeight[1].price)
            } else if(totalWeight[0].total_weight > maxWeight[1].weight && totalWeight[0].total_weight <= maxWeight[2].weight){
                fee = parseInt(maxWeight[2].price)
            }else if(totalWeight[0].total_weight > maxWeight[2].weight){
                fee = (parseInt(totalWeight[0].total_weight - maxWeight[2].weight) * 5000) + parseInt(maxWeight[2].price)
            }

            // get distance from order
            const getDistance = `SELECT distance FROM orders WHERE order_number = ${database.escape(order_number)}`
            const distance = await asyncQuery(getDistance)

            if(distance[0].distance/1000 > 50 ){
                return res.status(400).send(`Alamat anda diluar jangkauan pengiriman kami!`)
            }

            // update ongkir
            const updateOngkir = `UPDATE orders SET total_ongkir = ${database.escape(fee)}
                                WHERE order_number = ${database.escape(order_number)}`
            const result = await asyncQuery(updateOngkir)
            console.log("fee", fee)
            res.status(200).send(result)
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    },
    updatePaymentMethod: async(req,res)=>{
        const {payment_method_id, order_number} = req.body
        try {
            // update payment method id
            const update = `UPDATE orders SET payment_method_id = ${database.escape(payment_method_id)}
                            WHERE order_number = ${database.escape(order_number)}`
            const result = await asyncQuery(update)
            res.status(200).send(result)
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    }
}