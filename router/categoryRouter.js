const router = require("express").Router()

const {categoryController} = require("../controller")

router.get("/get", categoryController.getCategories)
router.patch("/edit/:id", categoryController.editCategory)
router.post("/insert", categoryController.insertCategory)
router.delete("/delete/:id", categoryController.deleteCategory)

module.exports = router