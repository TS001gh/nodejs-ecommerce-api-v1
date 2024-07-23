/* eslint-disable import/extensions */
import slugify from "slugify";
import { body, check } from "express-validator";
import { validatorMiddleware } from "../../middlewares/validatorMiddleware.js";

export const getBrandValidator = [
  check("id").isMongoId().withMessage("Invalid brand id format"),
  validatorMiddleware,
];
export const createBrandValidator = [
  check("name")
    .notEmpty()
    .withMessage("Brand should be exist")
    .isLength({ min: 3 })
    .withMessage("Too short brand name")
    .isLength({ max: 32 })
    .withMessage("Too long brand name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];
export const updateBrandValidator = [
  check("id").isMongoId().withMessage("Invalid brand id format"),
  body("name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    })
    .notEmpty()
    .optional()
    .withMessage("Name cannot be empty"),
  validatorMiddleware,
];
export const deleteBrandValidator = [
  check("id").isMongoId().withMessage("Invalid brand id format"),
  validatorMiddleware,
];
