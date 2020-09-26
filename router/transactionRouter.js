const router = require("express").Router()
const {transactionController} = require('../controller')
const {upload} = require('../helper/multer')

const DESTINATION = './public/receipt'
const uploader = upload(DESTINATION)

router.patch("/checkout/:order", transactionController.checkoutConfirmation)
router.post("/payment/upload/:order", uploader, transactionController.paymentUpload)
router.patch("/payment/:order", transactionController.paymentConfirmation)
router.patch("/send/:order", transactionController.sendConfirmation)
router.patch("/done/:order", transactionController.doneConfirmation)
router.patch("/cancel/:order", transactionController.cancelConfirmation)
router.patch("/reject/:order", transactionController.rejectConfirmation)

module.exports = router