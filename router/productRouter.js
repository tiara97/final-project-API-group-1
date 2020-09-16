// import module
const router = require('express').Router()

// import controller
const { productController } = require('../controllers')

//  route get product
router.get('/products', productController.getProduct)
router.get('/products/:id', productController.getProductById)
router.get('/products/price/:minPrice/:maxPrice', productController.getProductByPrice)
router.get('/products/warehouse/:id', productController.getProductInWarehouse)
router.post('/products/category', productController.getProductByCategory)

// route delete product
router.delete('/products/delete/:id', productController.delete)

// route edit product
router.patch('/products/edit/:product_id/:color_id/:warehouse_id', productController.editProduct)
router.patch('/products/edit/image/:product_id/', productController.editProductImage)
router.patch('/products/edit/stock/:product_id/:color_id/:warehouse_id', productController.editProductStock)

// route add product
router.post('/products/add', productController.addProduct)
router.post('/products/add/image', productController.addProductImage)
router.post('/products/add/stock', productController.addProductStock)

// export router
module.exports = router