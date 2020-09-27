const database = require('../database')
const {asyncQuery} = require("../helper/queryHelper")


module.exports= {
    getFavoriteAll: async(req,res)=>{
        try {
            // get favorite data
            const getFavorite = `SELECT f.id, f.user_id, p.name, pc.color, f.qty, f.price_each, pi.image FROM favorite f 
            JOIN products p ON f.product_id = p.id
            JOIN product_color pc ON f.color_id = pc.id
            JOIN product_images pi ON f.product_id = pi.product_id GROUP BY f.product_id;`
            const result = await asyncQuery(getFavorite)
            res.status(200).send(result)
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    },
    getFavoriteDataByID: async(req,res)=>{
        const Id = parseInt(req.params.id)
        try {
            // get favorite data
            const getFavorite = `SELECT f.id, f.user_id, p.name, pc.color, p.desc, f.qty, f.price_each, pi.image FROM favorite f 
            JOIN products p ON f.product_id = p.id
            JOIN product_color pc ON f.color_id = pc.id
            JOIN product_images pi ON f.product_id = pi.product_id WHERE f.user_id = ${database.escape(Id)}
            GROUP BY f.product_id;`
            const result = await asyncQuery(getFavorite)
            res.status(200).send(result)
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    },
    addFavorite: async(req,res)=> {
        const {product_id, color_id, price_each} = req.body
        // id user
        const Id = parseInt(req.params.id)
        try {
            const query = `INSERT INTO favorite (user_id, product_id, color_id, qty, price_each) VALUES (${database.escape(Id)}, ${database.escape(product_id)}, ${database.escape(color_id)}, 1, ${database.escape(price_each)});`
            const result = await asyncQuery(query)
            res.status(200).send(result)
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    },
    deleteFavorite: async(req,res)=> {
        // id favorite
        const Id = parseInt(req.params.id)
        try {
            const query = `DELETE FROM favorite WHERE id = ${database.escape(Id)}`
            const result = await asyncQuery(query)
            res.status(200).send(result)
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    }
}