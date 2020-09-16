const {body} = require("express-validator")

const registValidator = [
    body("username")
        .notEmpty()
        .withMessage("Username is required!")
        .isLength({ min: 6})
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
        .isLength({min: 6})
        .withMessage("Password minimal 6 characters!")
]

const passValidator = [
    body("password")
        .notEmpty()
        .withMessage("Password is required!")
        .matches(/[!@#$%^&*;]/)
        .withMessage("Password must include special characters!")
        .matches(/[0-9]/)
        .withMessage("Password must include number!")
        .isLength({min: 6})
        .withMessage("Password minimal 6 characters!")
]

module.exports = {registValidator, passValidator}