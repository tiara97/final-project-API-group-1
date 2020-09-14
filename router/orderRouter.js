const router = require("express").Router()

// import controller
const {orderController} = require("../controller")

router.get("/get/:id", orderController.getOrdersData)

module.exports= router