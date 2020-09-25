const router = require("express").Router()

const {categoryController} = require("../controller")

router.get("/get", categoryController.getCategories)
router.get("/get/warehouse/:warehouse_id/:admin_id", categoryController.getCategoriesByWarehouse)
router.patch("/edit/:id", categoryController.editCategory)
router.post("/add", categoryController.addCategory)
router.delete("/delete/:id", categoryController.deleteCategory)

module.exports = router