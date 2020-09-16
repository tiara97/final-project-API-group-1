const router = require("express").Router()

const {carouselController} = require("../controller")

router.get("/get", carouselController.getCarouselData)

module.exports = router