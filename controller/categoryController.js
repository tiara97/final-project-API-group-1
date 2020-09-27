const database = require("../database")
const {asyncQuery, generateQuery} = require("../helper/queryHelper")

module.exports = {
    getCategories: async(req,res)=>{
        try {
            // get all categories data
            const getCategories = `SELECT c2.id, c2.category, c1.category as parent 
                                FROM categories c1
                                RIGHT JOIN categories c2
                                ON c1.id = c2.parent_id;`
            const result = await asyncQuery(getCategories)
            res.status(200).send(result)
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    },
    getCategoriesByWarehouse: async(req,res)=>{
        try {
            // get all categories data
            const getCategories = `SELECT c1.category_id AS id, c1.category, c2.category as parent , c1.warehouse_id, c1.warehouse_name
                                FROM (SELECT pc.product_id, pc.category_id, GROUP_CONCAT(p.name) AS name, c.category, w.id AS warehouse_id, w.name AS warehouse_name FROM product_category pc
                                JOIN categories c ON pc.category_id = c.id
                                JOIN product_stock ps ON pc.product_id = ps.product_id
                                JOIN warehouse w ON ps.warehouse_id = w.id
                                JOIN products p ON pc.product_id = p.id
                                WHERE w.id = ${parseInt(req.params.admin_id)} AND w.admin_id = ${parseInt(req.params.warehouse_id)}
                                GROUP BY pc.category_id) AS c1
                                LEFT JOIN categories c2 ON c1.category_id = c2.parent_id;`
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
            // edit categories data
            const editCategory = `UPDATE categories SET ${generateQuery(req.body)}
                                    WHERE id = ${database.escape(Id)}`
            const result = await asyncQuery(editCategory)
            res.status(200).send(result)
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    },
    addCategory: async(req,res)=>{
        const {category, parent_id} = req.body
        try {
            // insert new category 
            const insertCategory = `INSERT INTO categories (category, parent_id) VALUES (${database.escape(category)}, ${database.escape(parent_id)})`
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
            // delete category
            const deleteCategory = `DELETE FROM categories WHERE id = ${database.escape(Id)}`
            const result = await asyncQuery(deleteCategory)
            res.status(200).send(result)
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    }
}