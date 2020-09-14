const router = require("express").Router()
const {passValidator, registValidator} = require("../helper/validator")
const {verify} = require("../helper/jwt")

// import controller
const { userController} = require("../controller")

// create router
router.post("/register", registValidator, userController.register)
router.post("/verification", verify, userController.emailVerification)
router.post("/login", userController.login)
router.patch("/edit/:id", userController.edit)
router.patch("/editPassword/:id", userController.editPassword)

module.exports = router