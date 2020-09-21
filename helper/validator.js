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

module.exports = { registValidator, passValidator }