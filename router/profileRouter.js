const router = require("express").Router()

// import controller
const {profileController} = require("../controller")

router.get("/get/:id", profileController.getProfile)
router.patch("/edit/:id", profileController.editProfile)
router.get("/getFavorite/:id", profileController.getFavoriteData)

module.exports = router