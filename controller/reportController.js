const database = require("../database")
const {asyncQuery} = require("../helper/queryHelper")

module.exports = {
    getTopProduct: async (req, res) => {
        const limit = parseInt(req.params.limit)
        try {
            const query = `SELECT od.product_id AS id, p.name, tb2.image, SUM(od.qty) AS qty, od.price_each FROM order_details od
                        JOIN products p ON od.product_id = p.id
                        JOIN (SELECT pi.product_id AS product_id,GROUP_CONCAT(pi.image SEPARATOR ',') AS image
	                        FROM product_images pi GROUP BY pi.product_id) tb2 ON od.product_id = tb2.product_id
                        GROUP BY od.product_id
                        ORDER BY qty DESC
                        LIMIT ${limit};`
            const result = await asyncQuery(query)

            result.forEach((item) => {
                item.image = item.image.split(",");
              });

            res.status(200).send(result)
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    }
}