// import module
const router = require('express').Router()
const {addProductValidator, addProductStockValidator} = require("../helper/validator")

// import controller
const { productController } = require('../controller')

//  route get product
router.get('/get/:type', productController.getProduct)
router.get('/details/:id', productController.getProductDetails)
router.get('/price/:minPrice/:maxPrice', productController.getProductByPrice)
router.get('/warehouse/:warehouse_id/:admin_id', productController.getProductInWarehouse)
router.get('/table/:table', productController.getProductByTable)

// route delete product
router.delete('/delete/:id', productController.delete)
router.delete('/delete/image/:id', productController.deleteProductImage)
router.delete('/delete/stock/:id', productController.deleteProductStock)

// route edit product
router.patch('/edit/:product_id', productController.editProduct)
router.patch('/edit/image/:product_id', productController.editProductImage)
router.patch('/edit/stock/:id', productController.editProductStock)
router.patch('/transfer-stock', productController.transferStock)

// route add product
router.post('/add', addProductValidator, productController.addProduct)
router.post('/add/image', productController.addProductImage)
router.post('/add/stock', addProductStockValidator, productController.addProductStock)

// export router
module.exports = router