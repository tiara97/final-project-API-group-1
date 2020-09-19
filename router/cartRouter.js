// import module
const router = require('express').Router()

// import controller
const { cartController } = require('../controller')

// create route
router.get('/cart/:id', cartController.getCart)
router.post('/cart/add', cartController.addToCart)
router.patch('/cart/edit/:id', cartController.editQtyInCart)
router.delete('/cart/delete/:id', cartController.deleteCart)

// export router
module.exports = router