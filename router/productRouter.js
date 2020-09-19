// import module
const router = require('express').Router()

// import controller
const { productController } = require('../controller')

//  route get product
router.get('', productController.getProduct)
router.get('/details/:id', productController.getProductDetails)
router.get('/price/:minPrice/:maxPrice', productController.getProductByPrice)
router.get('/warehouse/:id', productController.getProductInWarehouse)
router.post('/category', productController.getProductByCategory)

// route delete product
router.delete('/delete/:id', productController.delete)

// route edit product
router.patch('/edit/:product_id/:color_id/:warehouse_id', productController.editProduct)
router.patch('/edit/image/:product_id/', productController.editProductImage)
router.patch('/edit/stock/:product_id/:color_id/:warehouse_id', productController.editProductStock)

// route add product
router.post('/add', productController.addProduct)
router.post('/add/image', productController.addProductImage)
router.post('/add/stock', productController.addProductStock)

// export router
module.exports = router