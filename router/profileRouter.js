const router = require("express").Router()

// import controller
const {profileController} = require("../controller")
const {upload} = require('../helper/multer')

const DESTINATION = './public/image'
const uploader = upload(DESTINATION)

router.get("/get/:id", profileController.getProfile)
router.patch("/edit/:id", profileController.editProfile)
router.patch("/addAddress/:id", profileController.setMainAddress)
router.post("/upload/:id", uploader, profileController.picUpload)

module.exports = router