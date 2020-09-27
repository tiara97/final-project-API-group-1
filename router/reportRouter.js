const router = require("express").Router()

const {reportController} = require("../controller")

router.get("/top/:limit", reportController.getTopProduct)

module.exports = router