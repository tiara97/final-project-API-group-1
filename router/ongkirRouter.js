// import module
const router = require('express').Router()

// import controller
const {ongkirController} = require("../controller")


// create route
router.get("/get", ongkirController.getOngkirData)

module.exports = router