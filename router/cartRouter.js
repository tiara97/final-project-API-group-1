// import module
const router = require('express').Router()

// import controller
const { cartRouter } = require('../controller')

// create route
router.get('/cart/:id', cartRouter.getCart)
router.post('/cart/add', cartRouter.addToCart)
router.patch('/cart/edit/:id', cartRouter.editQtyInCart)
router.delete('/cart/delete/:id', cartRouter.deleteCart)

// export router
module.exports = router