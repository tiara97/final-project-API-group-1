const database = require("../database")
const {asyncQuery, generateQuery} = require("../helper/queryHelper")

module.exports = {
    getCategories: async(req,res)=>{
        try {
            const getCategories = `SELECT * FROM categories`
            const result = await asyncQuery(getCategories)
            res.status(200).send(result)
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    },
    editCategory: async(req,res)=>{
        const Id = req.params.id
        try {
            const editCategory = `UPDATE categories SET ${generateQuery(req.body)}
                                    WHERE id = ${database.escape(Id)}`
            const result = await asyncQuery(editCategory)
            res.status(200).send(result)
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    },
    insertCategory: async(req,res)=>{
        const {category} = req.body
        try {
            const insertCategory = `INSERT INTO categories (category) VALUES (${database.escape(category)})`
            const result = await asyncQuery(insertCategory)
            res.status(200).send(result)
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    },
    deleteCategory: async(req,res)=>{
        const Id = req.params.id
        try {
            const deleteCategory = `DELETE FROM categories WHERE id = ${database.escape(Id)}`
            const result = await asyncQuery(deleteCategory)
            res.status(200).send(result)
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    }
}