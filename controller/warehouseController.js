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
}