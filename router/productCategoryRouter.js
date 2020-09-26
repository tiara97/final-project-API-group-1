const router = require('express').Router()

const { productCategoryController } = require('../controller')

router.get('', productCategoryController.getProductCategory)
router.get('/filter/:category', productCategoryController.filterProductCategory)
router.post('/add', productCategoryController.addProductCategory)
router.delete('/delete/:product_id', productCategoryController.deleteProductCategory)
router.patch('/edit/:product_id', productCategoryController.editProductCategory)

module.exports = router