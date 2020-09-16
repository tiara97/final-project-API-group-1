const router = require("express").Router()

// import controller
const {orderController} = require("../controller")

router.get("/get", orderController.getOrdersData)
router.get("/getByUserID/:id", orderController.getOrdersById)
router.get("/getByWarehouseID/:id", orderController.getOrdersByWarehouse)

module.exports= router