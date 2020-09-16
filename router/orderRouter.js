const router = require("express").Router()

// import controller
const {orderController} = require("../controller")

<<<<<<< HEAD
router.get("/get/:id", orderController.getOrdersData)
=======
router.get("/get", orderController.getOrdersData)
router.get("/getByUserID/:id", orderController.getOrdersById)
router.get("/getByWarehouseID/:id", orderController.getOrdersByWarehouse)
>>>>>>> 8e0f3a20723367c31c58c45e31b02db6531c5496

module.exports= router