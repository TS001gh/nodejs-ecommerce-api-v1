/* eslint-disable import/extensions */
import slugify from "slugify";
import { body, check } from "express-validator";
import { validatorMiddleware } from "../../middlewares/validatorMiddleware.js";
import User from "../../models/userModel.js";
import ApiError from "../apiError.js";

export const getUserValidator = [
  check("id").isMongoId().withMessage("Invalid user id format"),
  validatorMiddleware,
];
export const createUserValidator = [
  check("name")
    .notEmpty()
    .withMessage("User Name should be provided")
    .isLength({ min: 6 })
    .withMessage("Too short user name")
    .isLength({ max: 32 })
    .withMessage("Too long user name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  check("email")
    .notEmpty()
    .withMessage("Email should be provided")
    .isEmail()
    .withMessage("Invalid email format")
    .custom(async (val) => {
      await User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(
            new Error(`This email address is already in use`)
          );
        }
      });
    }),

  check("password")
    .notEmpty()
    .withMessage("Password should be provided")
    .isLength({ min: 6 })
    .withMessage("Password should be at least 6 characters long")
    .isStrongPassword()
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, and one number, one symbol"
    )
    .custom((password, { req }) => {
      if (password !== req.body.passwordConfirm) {
        throw new Error("Password Confirmation incorrect");
      }
      return true;
    }),

  check("passwordConfirm")
    .notEmpty()
    .withMessage("Password confirmation required"),
  // .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{6,}$/)
  // .withMessage(
  //   "Password must contain at least one uppercase letter, one lowercase letter, and one number"
  // ),

  check("phone")
    .optional()
    .notEmpty()
    .withMessage("Phone number should be provided")
    .isMobilePhone(["tr-TR", "ar-SY", "ar-AE", "ar-SA"])
    .withMessage(
      "Invalid phone number provided, only accepted Türkiye, Syria, Saudi Arabia and United Arab Emirates phone numbers"
    ),

  check("profileImg")
    .optional()
    .notEmpty()
    .withMessage("Profile image should be provided"),
  validatorMiddleware,
];
export const updateUserValidator = [
  check("id").isMongoId().withMessage("Invalid user id format"),
  body("name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    })
    .notEmpty()
    .optional()
    .withMessage("Name cannot be empty"),
  check("email")
    .optional()
    .notEmpty()
    .withMessage("Email should be provided")
    .isEmail()
    .withMessage("Invalid email format"),
  validatorMiddleware,
];
export const deleteUserValidator = [
  check("id").isMongoId().withMessage("Invalid user id format"),
  validatorMiddleware,
];
