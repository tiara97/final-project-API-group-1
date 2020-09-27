const database = require('../database')
const {asyncQuery, generateQuery} = require('../helper/queryHelper')

module.exports = {
    getProductCategory: async(req,res)=>{
        const query = req.query
        try {
            // check sort query
            let sort = ''
            if (query._sort) {
                sort += `ORDER BY ${query._sort} ${ query._order ? query._order.toUpperCase() : 'ASC'}`
                console.log('sort query : ', sort)
            }

            let productCategory = ''
            if(query.category){
                let value = ''
                if(Array.isArray(query.category)){
                    query.category.map(item => value += `${database.escape(item)},`)
                    value = value.slice(0,-1)
                } else {
                    value = database.escape(query.category)
                }
                productCategory = `SELECT p.id, p.name, c.id as category_id, c.category, tb2.image, p.price, p.desc, CONCAT(p.height, ',', p.width, ',', p.length) AS size,
                                p.weight, p.material, tb1.color, tb1.stock_available, tb1.stock_ordered, tb1.warehouse_id
                                FROM ((((products p
                                JOIN (SELECT pstock.product_id, GROUP_CONCAT(pc.color SEPARATOR ',') AS color, GROUP_CONCAT(pstock.stock_available
                                SEPARATOR ',') AS stock_available, GROUP_CONCAT(pstock.stock_ordered SEPARATOR ',') AS stock_ordered,
                                GROUP_CONCAT(pstock.warehouse_id SEPARATOR ',') AS warehouse_id, w.admin_id AS admin_id
                                FROM((product_stock pstock 
                                JOIN product_color pc ON ((pstock.color_id = pc.id)))
                                JOIN warehouse w ON ((pstock.warehouse_id = w.id)))
                                GROUP BY pstock.product_id) tb1 ON ((p.id = tb1.product_id)))
                                JOIN (SELECT product_images.product_id AS product_id,GROUP_CONCAT(product_images.image SEPARATOR ',') AS image
                                FROM product_images GROUP BY product_images.product_id) tb2 ON ((p.id = tb2.product_id)))
                                JOIN product_category pc ON ((p.id = pc.product_id)))
                                JOIN categories c ON ((pc.category_id = c.id)))
                                WHERE c.category IN (${value})
                                ${sort}`
            } else {
                productCategory = ` SELECT pc.id, pc.product_id, pc.category_id, p.name, c.category FROM product_category pc
                                    JOIN products p ON pc.product_id = p.id
                                    JOIN categories c ON pc.category_id = c.id;`
            }
            const result = await asyncQuery(productCategory)

            
            if(query.category){
                // convert data multiple dimensions to array
                result.forEach((item) => {
                item.image = item.image.split(",");
                item.size = item.size.split(",");
                item.color = item.color.split(",");
                item.stock_available = item.stock_available.split(",");
                item.stock_ordered = item.stock_ordered.split(",");
                item.warehouse_id = item.warehouse_id.split(",");
                });
            }
            res.status(200).send(result)
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    },
    filterProductCategory: async (req, res) => {
        const {category} = req.params
        const query = req.query
        try {
            // check sort query
            let sort = ''
            if (query._sort) {
                sort += `ORDER BY ${query._sort} ${ query._order ? query._order.toUpperCase() : 'ASC'}`
                console.log('sort query : ', sort)
            }

          // get product by category
          const filterProcat = `SELECT p.id, p.name, c.id as category_id, c.category, tb2.image, p.price, p.desc, CONCAT(p.height, ',', p.width, ',', p.length) AS size,
                            p.weight, p.material, tb1.color, tb1.stock_available, tb1.stock_ordered, tb1.warehouse_id
                            FROM ((((products p
                            JOIN (SELECT pstock.product_id, GROUP_CONCAT(pc.color SEPARATOR ',') AS color, GROUP_CONCAT(pstock.stock_available
                            SEPARATOR ',') AS stock_available, GROUP_CONCAT(pstock.stock_ordered SEPARATOR ',') AS stock_ordered,
                            GROUP_CONCAT(pstock.warehouse_id SEPARATOR ',') AS warehouse_id, w.admin_id AS admin_id
                            FROM((product_stock pstock 
                              JOIN product_color pc ON ((pstock.color_id = pc.id)))
                            JOIN warehouse w ON ((pstock.warehouse_id = w.id)))
                            GROUP BY pstock.product_id) tb1 ON ((p.id = tb1.product_id)))
                            JOIN (SELECT product_images.product_id AS product_id,GROUP_CONCAT(product_images.image SEPARATOR ',') AS image
                            FROM product_images GROUP BY product_images.product_id) tb2 ON ((p.id = tb2.product_id)))
                            JOIN product_category pc ON ((p.id = pc.product_id)))
                            JOIN categories c ON ((pc.category_id = c.id))) WHERE category = '${category}'
                            ${sort}`;
          const result = await asyncQuery(filterProcat);
    
          // check result
          if(result.length === 0) return res.status(422).send('Filter product failed')
    
          // convert data multiple dimensions to array
          result.forEach((item) => {
            item.image = item.image.split(",");
            item.size = item.size.split(",");
            item.color = item.color.split(",");
            item.stock_available = item.stock_available.split(",");
            item.stock_ordered = item.stock_ordered.split(",");
            item.warehouse_id = item.warehouse_id.split(",");
          });
    
          // send result
          res.status(200).send(result);
        } catch (err) {
          // send error
          console.log(err)
          res.status(500).send(err);
        }
      },
    addProductCategory: async (req, res) =>{ 
        const { product_id, category_id } = req.body

        try {
            // get parent category_id
            const getCategoryId = `WITH RECURSIVE category_path (id, category, parent_id) AS
                                (
                                    SELECT id, category, parent_id
                                    FROM categories
                                    WHERE id = ${category_id} -- child node
                                    UNION ALL
                                    SELECT c.id, c.category, c.parent_id
                                    FROM category_path AS cp 
                                    JOIN categories AS c ON cp.parent_id = c.id
                                )
                                SELECT id from category_path`
            const categoryId = await asyncQuery(getCategoryId)

            // insert query
            let value = ''
            categoryId.forEach(item => categoryId.length > 1 ? value += `(${product_id}, ${item.id}),` : value = `(${product_id}, ${item.id})`)

            const addQuery = `INSERT INTO product_category (product_id, category_id) 
                            VALUES ${categoryId.length > 1 ? value.slice(0, -1) : value}`
            const resultAdd = await asyncQuery(addQuery)

            // send response to client
            res.status(200).send(resultAdd)

        } catch(err) {
            res.status(500).send(err)
        }
    },
    editProductCategory: async (req, res) => {
        const { category_id } = req.body

        try {
            // Check product in our database
            const checkId = `SELECT * FROM product_category WHERE product_id = ${parseInt(req.params.product_id)}`
            const resultCheck = await asyncQuery(checkId)

            // check result
            if(resultCheck.length === 0) return res.status(200).send(`Product id = ${parseInt(req.params.product_id)} doesn't exists`)

            // delete product
            const del = `DELETE FROM product_category WHERE product_id = ${parseInt(req.params.product_id)}`
            await asyncQuery(del)

            // get parent category_id
            const getCategoryId = `WITH RECURSIVE category_path (id, category, parent_id) AS
                                (
                                    SELECT id, category, parent_id
                                    FROM categories
                                    WHERE id = ${category_id} -- child node
                                    UNION ALL
                                    SELECT c.id, c.category, c.parent_id
                                    FROM category_path AS cp 
                                    JOIN categories AS c ON cp.parent_id = c.id
                                )
                                SELECT id from category_path`
            const categoryId = await asyncQuery(getCategoryId)
            
            // insert query
            let value = ''
            categoryId.forEach(item => categoryId.length > 1 ? value += `(${parseInt(req.params.product_id)}, ${item.id}),` : value = `(${parseInt(req.params.product_id)}, ${item.id})`)

            const addQuery = `INSERT INTO product_category (product_id, category_id) 
                            VALUES ${categoryId.length > 1 ? value.slice(0, -1) : value}`
            const resultAdd = await asyncQuery(addQuery)

            res.status(200).send(resultAdd)
        } catch (err) {
            res.status(500).send(err)
        }
    },
    deleteProductCategory : async (req, res) => {
        try {
            // check if user with id is exists in our database
            const checkId = `SELECT * FROM product_category WHERE product_id = ${parseInt(req.params.product_id)}`
            const resultCheck = await asyncQuery(checkId)

            // check result
            if(resultCheck.length === 0) return res.status(200).send(`Product with product_id: ${parseInt(req.params.product_id)} doesn\'t exists.`)

            // if user exists in our databse
            const del = `DELETE FROM product_category WHERE product_id = ${parseInt(req.params.product_id)}`
            const resultDel = await asyncQuery(del)

            res.status(200).send(resultDel)
        } catch (err) {
            res.status(500).send(err)
        }
    }, 
}