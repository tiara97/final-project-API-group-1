// import module
const router = require('express').Router()

// import controller
const { cartController } = require('../controller')

// create route

router.get('/:id', cartController.getCart)
router.post('/add', cartController.addToCart)
router.patch('/edit/:id', cartController.editQtyInCart)
router.delete('/delete/:id', cartController.deleteCart)
router.patch('/warehouseID/:id', cartController.updateWarehouseID)
router.patch('/getOngkir', cartController.getOngkir)
router.patch('/updatePayment', cartController.updatePaymentMethod)

// export router
module.exports = router