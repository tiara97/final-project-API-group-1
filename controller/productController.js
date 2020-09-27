const database = require("../database");
const {validationResult} = require("express-validator");
const { generateQuery, asyncQuery } = require("../helper/queryHelper");

module.exports = {
  getProduct: async (req, res) => {
    const {type} = req.params
    const query = req.query
    try {
      // check sort query
      let sort = ''
      if (query._sort) {
          sort += `ORDER BY ${query._sort} ${ query._order ? query._order.toUpperCase() : 'ASC'}`
          console.log('sort query : ', sort)
      }
      
      // get data all product
      let getData = ''
      if(type === 'only_product'){
        getData = `SELECT * FROM products`
      } else if(type === 'product_details') {
        getData = `SELECT p.id, p.name, tb2.image, p.price, p.desc, CONCAT(height, ',', width, ',', length) AS size, p.weight, p.material, color, stock_available, stock_ordered, warehouse_id
                FROM products p
                JOIN (SELECT product_id, GROUP_CONCAT(pc.color) AS color, GROUP_CONCAT(stock_available) AS stock_available, GROUP_CONCAT(stock_ordered) AS stock_ordered, GROUP_CONCAT(warehouse_id) AS warehouse_id
                    FROM product_stock pstock
                    JOIN product_color pc ON pstock.color_id = pc.id
                    GROUP BY product_id) AS tb1 ON p.id = tb1.product_id
                JOIN (SELECT product_id, GROUP_CONCAT(image) AS image
                    FROM product_images
                    GROUP BY product_id) AS tb2 ON p.id = tb2.product_id
                ${sort}`
      } else if(type === 'product_img_group'){
        getData = `SELECT p.id, p.name, GROUP_CONCAT(pi.image) AS image FROM product_images pi
              RIGHT JOIN products p ON pi.product_id = p.id
              GROUP BY p.id`
      }
      const result = await asyncQuery(getData);

      if(type === 'product_details'){
        // declare new property
        result.total_stock_available = 0
        result.total_stock_ordered = 0
        result.total_stock_operational = 0
  
        // convert data multiple dimensions to array
        result.forEach((item) => {
          item.image = item.image.split(",");
          item.size = item.size.split(",");
          item.color = item.color.split(",");
          item.stock_available = item.stock_available.split(",");
          item.stock_ordered = item.stock_ordered.split(",");
          item.warehouse_id = item.warehouse_id.split(",");
          item.total_stock_available = item.stock_available.reduce((a, b) => parseInt(a) + parseInt(b))
          item.total_stock_ordered = item.stock_ordered.reduce((a, b) => parseInt(a) + parseInt(b))
          item.total_stock_operational = item.total_stock_available + item.total_stock_ordered
        });
      } else if(type === 'product_img_group'){
          result.forEach((item) => {
            item.image ? item.image = item.image.split(",") : item.image = []
          });
      }

      // send result
      res.status(200).send(result);
    } catch (error) {
      // send error
      console.log(error);
      res.status(500).send(error);
    }
  },
  getProductByTable: async (req, res) => {
    const {table} = req.params
    try {
      // get data all product
      let query = ''
      
      if (table === 'product_image'){
        query = `SELECT pi.id, p.id AS product_id, p.name, pi.image FROM product_images pi
              RIGHT JOIN products p ON pi.product_id = p.id`
      } else if (table === 'product_stock'){
        query = `SELECT ps.*, p.name, pc.color, w.name AS warehouse_name FROM products p
              JOIN product_stock ps ON p.id = ps.product_id
              JOIN product_color pc ON ps.color_id = pc.id
              JOIN warehouse w ON ps.warehouse_id = w.id;`  
      } else if (table === 'product_color'){
        query = `SELECT * FROM product_color;`
      } else if(table === 'only_product'){
        query = `SELECT * FROM products`
      }
      const result = await asyncQuery(query);

      // send result
      res.status(200).send(result);
    } catch (error) {
      // send error
      console.log(error);
      res.status(500).send(error);
    }
  },
  getProductDetails: async (req, res) => {
    try {
      // get product by id
      const productDetails = `SELECT p.id, p.name, tb3.category, tb2.image, p.price, p.desc, CONCAT(height, ',', width, ',', length) AS size, p.weight, p.material, color, stock_available, stock_ordered, warehouse_id
                          FROM products p
                          JOIN (SELECT product_id, GROUP_CONCAT(pc.color) AS color, GROUP_CONCAT(stock_available) AS stock_available, GROUP_CONCAT(stock_ordered) AS stock_ordered, GROUP_CONCAT(warehouse_id) AS warehouse_id
                              FROM product_stock pstock
                              JOIN product_color pc ON pstock.color_id = pc.id
                              GROUP BY product_id) AS tb1 ON p.id = tb1.product_id
                          JOIN (SELECT product_id, GROUP_CONCAT(image) AS image
                              FROM product_images
                              GROUP BY product_id) AS tb2 ON p.id = tb2.product_id
                          JOIN (SELECT pc.product_id, c.category FROM categories c
                              JOIN product_category pc ON c.id = pc.category_id) AS tb3 ON p.id = tb3.product_id
                          WHERE id = ${req.params.id}`;
      const result = await asyncQuery(productDetails);

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
      res.status(200).send(result[0]);
    } catch (err) {
      // send error
      console.log(err)
      res.status(500).send(err);
    }
  },
  getProductByPrice: async (req, res) => {
    const {minPrice, maxPrice} = req.params
    try {
      const getProductById = `SELECT p.id, p.name, tb2.image, p.price, p.desc, CONCAT(height, ',', width, ',', length) AS size, p.weight, p.material, color, stock_available, stock_ordered, warehouse_id
                            FROM products p
                            JOIN (
                              SELECT product_id, GROUP_CONCAT(pc.color) AS color, GROUP_CONCAT(stock_available) AS stock_available, GROUP_CONCAT(stock_ordered) AS stock_ordered,
                              GROUP_CONCAT(pstock.warehouse_id) AS warehouse_id, admin_id
                              FROM product_stock pstock
                              JOIN product_color pc ON pstock.color_id = pc.id
                                JOIN warehouse w ON pstock.warehouse_id = w.id
                              GROUP BY product_id
                            ) AS tb1 ON p.id = tb1.product_id
                            JOIN (SELECT product_id, GROUP_CONCAT(image) AS image FROM product_images
                            GROUP BY product_id) AS tb2 ON p.id = tb2.product_id
                            WHERE price BETWEEN ${parseInt(minPrice)} AND ${parseInt(maxPrice)};`;
      const result = await asyncQuery(getProductById);

      // check result
      if(result.length === 0) return res.status(200).send('Products doesn\'t exists')

      // convert data multiple dimensions to array
      result.forEach((item) => {
        item.image = item.image.split(",");
        item.size = item.size.split(",");
        item.color = item.color.split(",");
        item.stock_available = item.stock_available.split(",");
        item.stock_ordered = item.stock_ordered.split(",");
        item.warehouse_id = item.warehouse_id.split(",");
      });

      // send response
      res.status(200).send(result);
    } catch (err) {
      // send error
      console.log(err)
      res.status(500).send(err);
    }
  },
  getProductInWarehouse: async (req, res) => {
    const {admin_id, warehouse_id} = req.params
    try {
      // get product in warehouse
      const getProductWarehouse = `SELECT p.id, p.name, tb3.category, tb2.image, p.price, p.desc, CONCAT(height, ',', width, ',', length) AS size, p.weight, p.material, color, stock_available, 
                          stock_ordered FROM products p
                          JOIN (
                            SELECT product_id, GROUP_CONCAT(pc.color) AS color, GROUP_CONCAT(stock_available) AS stock_available, GROUP_CONCAT(stock_ordered) AS stock_ordered,
                            warehouse_id, admin_id
                            FROM product_stock pstock
                            JOIN product_color pc ON pstock.color_id = pc.id
                              JOIN warehouse w ON pstock.warehouse_id = w.id
                              WHERE admin_id = ${admin_id} OR warehouse_id = ${warehouse_id}
                            GROUP BY product_id
                          ) AS tb1 ON p.id = tb1.product_id
                          JOIN (SELECT product_id, GROUP_CONCAT(image) AS image FROM product_images
                          GROUP BY product_id) AS tb2 ON p.id = tb2.product_id
                          JOIN (SELECT pc.product_id, c.category
                            FROM categories c
                            JOIN product_category pc ON c.id = pc.category_id) AS tb3 ON p.id = tb3.product_id;`;
      const result = await asyncQuery(getProductWarehouse);

      // get data admin warehouse
      const getAdmin = `SELECT * FROM warehouse WHERE admin_id = ${admin_id} OR id = ${warehouse_id}`
      const resultAdmin = await asyncQuery(getAdmin)

      // declare new property
      result.total_stock_available = 0
      result.total_stock_ordered = 0
      result.total_stock_operational = 0
      
      // convert data multiple dimensions to array
      result.forEach((item) => {
        item.image = item.image.split(",");
        item.size = item.size.split(",");
        item.stock_available = item.stock_available.split(",");
        item.stock_ordered = item.stock_ordered.split(",");
        item.total_stock_available = item.stock_available.reduce((a, b) => parseInt(a) + parseInt(b))
        item.total_stock_ordered = item.stock_ordered.reduce((a, b) => parseInt(a) + parseInt(b))
        item.total_stock_operational = parseInt(item.total_stock_available) + parseInt(item.total_stock_ordered)
      });

      // send response
      res.status(200).send({product: result, admin_id: resultAdmin[0].admin_id, warehouse_id: resultAdmin[0].warehouse_id, warehouse_name: resultAdmin[0].name});
    } catch (err) {
      // send error
      console.log(err)
      res.status(500).send(err);
    }
  },
  editProduct: async (req, res) => {
    const { product_id } = req.params;
    try {
      // Check product in our database
      const checkId = `SELECT * FROM products
                    WHERE id = ${product_id}`;
      const resultCheck = await asyncQuery(checkId);

      // send response if product doesnt exists 
      if (resultCheck.length === 0)
        return res
          .status(200)
          .send(`Product with id = ${product_id} doesn't exists`);

      // edit product in database
      const editQuery = `UPDATE products SET ${generateQuery(req.body)}
                    WHERE id = ${resultCheck[0].id}`;
      const resultEdit = await asyncQuery(editQuery);

      // send response
      res.status(200).send(resultEdit);
    } catch (err) {
      // send error
      console.log(err)
      res.status(500).send(err);
    }
  },
  editProductImage: async (req, res) => {
    const { image, id } = req.body;
    const product_id = parseInt(req.params.product_id)
    try {
      // Check product in our database
      const checkId = `SELECT * FROM product_images
                    WHERE product_id = ${product_id}`;
      const resultCheck = await asyncQuery(checkId);

      // send response if product doesnt exists
      if (resultCheck.length === 0)
        return res.status(200).send(`Product with id = ${product_id} doesn't exists`);

      // edit product in database
      const editQuery = `UPDATE product_images SET image = '${image}' 
                    WHERE id = ${id}`;
      const resultEdit = await asyncQuery(editQuery);

      // send response
      res.status(200).send(resultEdit);
    } catch (err) {
      // send error
      console.log(err)
      res.status(500).send(err);
    }
  },
  editProductStock: async (req, res) => {
    const { id } = req.params;
    
    try {
      // Check product in our database
      const checkId = `SELECT * FROM product_stock
                    WHERE id = ${parseInt(id)}`;
      const resultCheck = await asyncQuery(checkId);

      // send response if product doesnt exists 
      if (resultCheck.length === 0)
        return res.status(200).send(`Product doesn't exists`);

      // edit product in database
      const editQuery = `UPDATE product_stock SET ${generateQuery(req.body)}
                    WHERE id = ${parseInt(id)}`;
      const resultEdit = await asyncQuery(editQuery);

      // send response
      res.status(200).send(resultEdit);
    } catch (err) {
      // send error
      console.log(err)
      res.status(500).send(err);
    }
  },
  delete: async (req, res) => {
    const id = parseInt(req.params.id);

    try {
      // check if product with id is exists in our database
      const checkProduct = `SELECT * FROM products WHERE id=${id}`;
      const resultCheck = await asyncQuery(checkProduct);

      // send response if product already exists 
      if (resultCheck.length === 0)
        return res.status(200).send(`products with id: ${id} doesn\'t exists.`);

      // delete data products in table products, product image, and product stock
      const del_products = `DELETE FROM products WHERE id=${id}`;
      await asyncQuery(del_products);
      const del_productImages = `DELETE FROM product_images WHERE product_id=${id}`;
      await asyncQuery(del_productImages);
      const del_productStock = `DELETE FROM product_stock WHERE product_id=${id}`;
      await asyncQuery(del_productStock);

      // send result
      res.status(200).send(`Product with id: ${id} already deleted from database`);
    } catch (err) {
      // send error
      console.log(err)
      res.status(500).send(err);
    }
  },
  deleteProductImage: async (req, res) => {
    const id = parseInt(req.params.id);

    try {
      // check if product with id is exists in our database
      const checkProduct = `SELECT * FROM product_images WHERE id=${id}`;
      const resultCheck = await asyncQuery(checkProduct);

      // send response if product doesnt exists 
      if (resultCheck.length === 0)
        return res.status(200).send(`Image with id: ${id} doesn\'t exists.`);

      // delete data image in table product image
      const del_productImages = `DELETE FROM product_images WHERE id=${id}`;
      await asyncQuery(del_productImages);

      // send result
      res.status(200).send(`Image with id: ${id} already deleted from database`);
    } catch (err) {
      // send error
      console.log(err)
      res.status(500).send(err);
    }
  },
  deleteProductStock: async (req, res) => {
    const id = parseInt(req.params.id);

    try {
      // check if product with id is exists in our database
      const checkProduct = `SELECT * FROM product_stock WHERE id=${id}`;
      const resultCheck = await asyncQuery(checkProduct);

      // send response if product already exists 
      if (resultCheck.length === 0)
        return res.status(200).send(`Stock with id: ${id} doesn\'t exists.`);

      // delete data products in table product stock
      const del_productStock = `DELETE FROM product_stock WHERE id=${id}`;
      await asyncQuery(del_productStock);

      // send result
      res.status(200).send(`Stock with id: ${id} already deleted from database`);
    } catch (err) {
      // send error
      console.log(err)
      res.status(500).send(err);
    }
  },
  addProduct: async (req, res) => {
    const { name, price, desc, height, width, length, weight, material } = req.body;
    const error = validationResult(req)

    // check input with express validator
    if(!error.isEmpty()){
        return res.status(422).send({errors: error.array()[0].msg})
    }

    try {
      // check if product with id exist in our database
      const checkProduct = `SELECT * FROM products WHERE name = ${database.escape(name)}`;
      const check = await asyncQuery(checkProduct);

      // check duplicate product in table products
      if (check.length > 0)
        return res.status(400).send("product already exist.");

      // insert new products into database
      const add = `INSERT INTO products (\`name\`, price, \`desc\`, height, width, \`length\`, weight, material) 
                VALUES (${database.escape(name)}, ${database.escape(price)}, ${database.escape(desc)},
                ${database.escape(height)}, ${database.escape(width)}, ${database.escape(length)}, 
                ${database.escape(weight)}, ${database.escape(material)})`;
      const result2 = await asyncQuery(add);

      // send response
      res.status(200).send(result2);
    } catch (err) {
      // send error
      console.log(err)
      res.status(500).send(err);
    }
  },
  addProductImage: async (req, res) => {
    const { product_id, image } = req.body;
    try {
      // check if product with id exist in our database
      const checkProduct = `SELECT * FROM products WHERE id=${database.escape(product_id)}`;
      const check = await asyncQuery(checkProduct);

      // check product in table products
      if (check.length === 0)
        return res.status(400).send("Product doesn\'t exist.");

      // insert new product image into database
      const add = `INSERT INTO product_images (product_id, image) 
                VALUES (${database.escape(product_id)}, ${database.escape(image)})`;
      const resultAdd = await asyncQuery(add);

      // send response
      res.status(200).send(resultAdd);
    } catch (err) {
      // send error
      console.log(err)
      res.status(500).send(err);
    }
  },
  addProductStock: async (req, res) => {
    const { product_id, color_id, warehouse_id, stock_available, stock_ordered } = req.body;
    const error = validationResult(req)

    // check input with express validator
    if(!error.isEmpty()){
        return res.status(422).send({errors: error.array()[0].msg})
    }
    try {
      // check if product with id exist in our database
      const checkProduct = `SELECT * FROM products WHERE id=${database.escape(product_id)}`;
      const check = await asyncQuery(checkProduct);

      // check product in table products
      if (check.length === 0)
        return res.status(400).send("Product doesn\'t exist.");

      // insert new data product stock into database
      const add = `INSERT INTO product_stock (product_id, color_id, warehouse_id, stock_available, stock_ordered) 
                VALUES (${database.escape(product_id)}, ${database.escape(color_id)}, ${database.escape(warehouse_id)},
                ${database.escape(stock_available)}, ${database.escape(stock_ordered)})`;
      const result2 = await asyncQuery(add);

      // send response
      res.status(200).send(result2);
    } catch (err) {
      // send error
      console.log(err)
      res.status(500).send(err);
    }
  },
  transferStock: async (req, res) => {
    const {product_id, color_id, from_warehouse, to_warehouse, quantity} = req.body
    try {
      // check warehouse
      if(from_warehouse === to_warehouse)
        return res.status(422).send(`You must send item from two different warehouse`)

      // Check product in our database
      const checkFrom = `SELECT * FROM product_stock
                    WHERE product_id = ${product_id} AND color_id = ${color_id} AND warehouse_id = ${from_warehouse}`;
      const resultCheckFrom = await asyncQuery(checkFrom);
      const checkTo = `SELECT * FROM product_stock
                    WHERE product_id = ${product_id} AND color_id = ${color_id} AND warehouse_id = ${to_warehouse}`;
      const resultCheckTo = await asyncQuery(checkTo);

      // check stock gudang pengirim
      if(resultCheckFrom[0].stock_available < quantity)
        return res.status(422).send(`Stock warehouse: ${from_warehouse} not enough`)

      // edit product in database
      const editFrom = `UPDATE product_stock SET stock_available = ${parseInt(resultCheckFrom[0].stock_available) - parseInt(quantity)}
                    WHERE id = ${parseInt(resultCheckFrom[0].id)}`;
      await asyncQuery(editFrom);
      const editTo = `UPDATE product_stock SET stock_available = ${parseInt(resultCheckTo[0].stock_available) + parseInt(quantity)}
                    WHERE id = ${parseInt(resultCheckTo[0].id)}`;
      await asyncQuery(editTo);

      // send response
      res.status(200).send("Transfer stock success");
    } catch (err) {
      // send error
      console.log(err)
      res.status(500).send(err);
    }
  }
};
