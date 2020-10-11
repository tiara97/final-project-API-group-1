const router = require("express").Router()

const {ratingController} = require("../controller")

router.post("/add", ratingController.addRating)
router.get("/get/:id", ratingController.getRatingByUser)

module.exports = router