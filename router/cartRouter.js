// import module
const router = require('express').Router()

// import controller
const { cartController } = require('../controller')

// create route

router.get('/:id', cartController.getCart)
router.post('/add', cartController.addToCart)
router.patch('/edit/:id', cartController.editQtyInCart)
router.delete('/delete/:id', cartController.deleteCart)
router.patch('/cart/warehouseID/:id', cartController.updateWarehouseID)

// export router
module.exports = router