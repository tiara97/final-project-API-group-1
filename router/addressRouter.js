const router = require("express").Router()

const {addressController} = require("../controller")

router.get("/get", addressController.getAddress)
router.get("/get/:id", addressController.getAddressByID)
router.post("/add/:id", addressController.addAddress)
router.patch("/edit/:id", addressController.editAddress)
router.delete("/delete/:id", addressController.deleteAddress)

module.exports = router

