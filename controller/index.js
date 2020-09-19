// import all controller
const productController = require('./productController')
const cartController = require('./cartController')
const userController = require("./userController")
const orderController = require("./orderController")
const profileController = require("./profileController")
const carouselController = require("./carouselController")
const transactionController = require('./transactionController')
const warehouseController = require('./warehouseController')
const categoryController = require("./categoryController")

module.exports = {
    userController,
    orderController,
    profileController,
    carouselController,
    transactionController,
    warehouseController,
    categoryController,
    productController, 
    cartController

}