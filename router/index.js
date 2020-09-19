// import routers
const productRouter = require("./productRouter");
const cartRouter = require("./cartRouter");
const userRouter = require("./userRouter");
const orderRouter = require("./orderRouter");
const profileRouter = require("./profileRouter");
const carouselRouter = require("./carouselRouter");
const transactionRouter = require("./transactionRouter");
const warehouseRouter = require("./warehouseRouter");
const categoryRouter = require("./categoryRouter")

// export router
module.exports = {
  productRouter,
  cartRouter,
  userRouter,
  orderRouter,
  profileRouter,
  carouselRouter,
  transactionRouter,
  warehouseRouter,
  categoryRouter
};
