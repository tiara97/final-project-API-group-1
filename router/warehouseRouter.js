const router = require("express").Router()
const {warehouseController} = require('../controller')

router.get('/get', warehouseController.getWarehouse)
router.get('/get/:id', warehouseController.getWarehouseById)
router.patch('/edit/:id', warehouseController.editWarehouse)
router.post('/add', warehouseController.addWarehouse)
router.delete('/delete/:id', warehouseController.deleteWarehouse)


module.exports = router