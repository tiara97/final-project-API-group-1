const database = require("../database")
const { asyncQuery, generateQuery } = require('../helper/queryHelper')

module.exports = {
    // get all data
    getWarehouse: async(req,res)=>{
        try {
            const query = `SELECT * FROM warehouse`
            const result = await asyncQuery(query)
            res.status(200).send(result)
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    },
    // get all data by id
    getWarehouseById: async(req,res)=>{
        const Id = parseInt(req.params.id)
        try {
            // check warehouse id
            const query = `SELECT * FROM warehouse WHERE admin_id = ${database.escape(Id)}`
            const result = await asyncQuery(query)
            if(result.length === 0){
                return res.status(400).send(`Warehouse with id : ${Id} doesn\'t exists`)
            }
            res.status(200).send(result)
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    },
    // edit warehouse
    editWarehouse: async(req,res)=>{
        const Id = parseInt(req.params.id)
        try {
            // check warehouse id
            const checkId = `SELECT * FROM warehouse WHERE id = ${database.escape(Id)}`
            const resultId = await asyncQuery(checkId)
            if(resultId.length === 0){
                return res.status(400).send(`Warehouse with id : ${Id} doesn\'t exists`)
            }
            // update database
            const edit = `UPDATE warehouse SET ${generateQuery(req.body)}
                        WHERE id = ${database.escape(Id)}`
            const result = await asyncQuery(edit)
            res.status(200).send(result)
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    },
    // add new warehouse
    addWarehouse : async(req,res) => {
        const { name, address, city, province, postcode, admin_id} = req.body
        try {
            const query = `INSERT INTO warehouse (name, address, city, province, postcode, admin_id)
            VALUES (${database.escape(name)}, ${database.escape(address)}, ${database.escape(city)}, ${database.escape(province)}, ${database.escape(postcode)}, ${database.escape(admin_id)})`
            const result = await asyncQuery(query)
            res.status(200).send(result)
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    },
    // delete warehouse
    deleteWarehouse: async(req,res)=>{
        const Id = parseInt(req.params.id)
        try {
            // check warehouse id
            const query = `DELETE FROM warehouse WHERE id = ${database.escape(Id)}`
            const result = await asyncQuery(query)
            res.status(200).send(result)
        } catch (error) {
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
                    d === Math.min(...jarak)? warehouseID = item.id : null
                    )
                })
            console.log("warehouse id : ",warehouseID)

            // Update warehouse id on table orders
            const updateOrders = `UPDATE orders SET warehouse_id = ${database.escape(warehouseID)}
                                WHERE order_number = ${database.escape(order_number)}`
            const result = await asyncQuery(updateOrders)

            res.status(200).send(result)
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    }
}