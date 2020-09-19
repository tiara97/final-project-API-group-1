const router = require("express").Router()

// import controller
const {profileController} = require("../controller")
const {upload} = require('../helper/multer')

const DESTINATION = './public/image'
const uploader = upload(DESTINATION)

router.get("/get/:id", profileController.getProfile)
router.patch("/edit/:id", profileController.editProfile)
router.post("/upload/:id", uploader, profileController.picUpload)
router.get("/getFavorite/:id", profileController.getFavoriteData)

module.exports = router