const { body } = require("express-validator")

const registValidator = [
    body("username")
        .notEmpty()
        .withMessage("Username is required!")
        .isLength({ min: 6 })
        .withMessage("Username minimal 6 characters!"),
    body("email")
        .notEmpty()
        .withMessage("Email is required!")
        .isEmail()
        .withMessage("Email doesn't valid!"),
    body("password")
        .notEmpty()
        .withMessage("Password is required!")
        .matches(/[!@#$%^&*;]/)
        .withMessage("Password must include special characters!")
        .matches(/[0-9]/)
        .withMessage("Password must include number!")
        .isLength({ min: 6 })
        .withMessage("Password minimal 6 characters!"),
    body("user_fullname")
        .notEmpty()
        .withMessage("Name is required!"),
    body("phone")
        .notEmpty()
        .withMessage("Phone number is required!"),
    body("address")
        .notEmpty()
        .withMessage("Address is required!"),
    body("city")
        .notEmpty()
        .withMessage("City is required!"),
    body("province")
        .notEmpty()
        .withMessage("Province is required!"),
    body("postcode")
        .notEmpty()
        .withMessage("Postcode is required!")
]

const passValidator = [
    body("password")
        .notEmpty()
        .withMessage("Password is required!")
        .matches(/[!@#$%^&*;]/)
        .withMessage("Password must include special characters!")
        .matches(/[0-9]/)
        .withMessage("Password must include number!")
        .isLength({ min: 6 })
        .withMessage("Password minimal 6 characters!")
]

const addProductValidator = [
    body("name")
        .notEmpty()
        .withMessage("Product name is required!")
        .isLength({ min: 6 })
        .withMessage("Product name minimal 6 characters!"),
    body("price")
        .notEmpty()
        .withMessage("Product price is required!")
        .matches(/^[0-9]+$/)
        .withMessage("Price only allows numbers!"),
    body("weight")
        .notEmpty()
        .withMessage("Product weight is required!")
        .matches(/^[0-9]+$/)
        .withMessage("Weight only allows number!"),
    body("length")
        .notEmpty()
        .withMessage("Product length is required!")
        .matches(/^[0-9]+$/)
        .withMessage("Length only allows number!"),
    body("width")
        .notEmpty()
        .withMessage("Product width is required!")
        .matches(/^[0-9]+$/)
        .withMessage("Width only allows number!"),
    body("height")
        .notEmpty()
        .withMessage("Product height is required!")
        .matches(/^[0-9]+$/)
        .withMessage("Height only allows number!"),
    body("desc")
        .notEmpty()
        .withMessage("Description product is required!")
        .matches(/([A-Z]|[a-z])/)
        .withMessage("Description product must include characters!"),
    body("material")
        .notEmpty()
        .withMessage("Product material is required!")
        .matches(/([A-Z]|[a-z])/)
        .withMessage("Product material must include characters!")
]

const addProductStockValidator = [
    body("product_id")
        .notEmpty()
        .withMessage("Product id is required!")
        .matches(/^[0-9]+$/)
        .withMessage("Product id only allows numbers!"),
    body("color_id")
        .notEmpty()
        .withMessage("Color id is required!")
        .matches(/^[0-9]+$/)
        .withMessage("Color id only allows number!"),
    body("warehouse_id")
        .notEmpty()
        .withMessage("Warehouse id is required!")
        .matches(/^[0-9]+$/)
        .withMessage("Warehouse id only allows number!"),
    body("stock_available")
        .notEmpty()
        .withMessage("Stock availalble width is required!")
        .matches(/^[0-9]+$/)
        .withMessage("Stock availalble only allows number!"),
    body("stock_ordered")
        .notEmpty()
        .withMessage("Stock ordered is required!")
        .matches(/^[0-9]+$/)
        .withMessage("Stock ordered only allows number!"),
]

module.exports = { registValidator, passValidator, addProductValidator, addProductStockValidator}