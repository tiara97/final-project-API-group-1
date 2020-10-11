// import all controller
const productController = require("./productController");
const cartController = require("./cartController");
const userController = require("./userController");
const orderController = require("./orderController");
const profileController = require("./profileController");
const carouselController = require("./carouselController");
const transactionController = require("./transactionController");
const warehouseController = require("./warehouseController");
const categoryController = require("./categoryController");
const addressController = require("./addressController");
const favoriteController = require("./favoriteController");
const productCategoryController = require("./productCategoryController");
const reportController = require('./reportController')
const ongkirController = require('./ongkirController')
const ratingController = require('./ratingController')

module.exports = {
  userController,
  orderController,
  profileController,
  carouselController,
  transactionController,
  warehouseController,
  categoryController,
  productController,
  cartController,
  addressController,
  favoriteController,
  productCategoryController,
  reportController,
  ongkirController,
  ratingController
};
