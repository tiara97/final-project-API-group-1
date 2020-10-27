const router = require("express").Router()
const {passValidator, registValidator} = require("../helper/validator")
const {verify} = require("../helper/jwt")

// import controller
const { userController} = require("../controller")

// create router
router.get("/get", userController.getUsersData)
router.get("/getAdmin", userController.getUsersDataAdmin)
router.get("/getAdminByID/:id", userController.getUsersDataAdminByID)
router.get("/getByQuery", userController.getUsersByQuery)
router.post("/register", registValidator, userController.register)
router.post("/verification", verify, userController.emailVerification)
router.post("/login", userController.login)
router.post("/keepLogin", verify, userController.keepLogin)
router.patch("/edit/:id", userController.editUser)
router.patch("/editPassword/:id", passValidator, userController.editPassword)

module.exports = router