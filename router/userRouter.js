const router = require("express").Router()
const {passValidator, registValidator} = require("../helper/validator")
const {verify} = require("../helper/jwt")

// import controller
const { userController} = require("../controller")

// create router
router.post("/register", registValidator, userController.register)
router.post("/verification", verify, userController.emailVerification)
router.post("/login", userController.login)
router.post("/keepLogin", verify, userController.keepLogin)
router.patch("/edit/:id", userController.editUser)
router.patch("/editPassword/:id", passValidator, userController.editPassword)
<<<<<<< HEAD
=======
router.patch("/editRole/:id", userController.editRole)
>>>>>>> 8e0f3a20723367c31c58c45e31b02db6531c5496

module.exports = router