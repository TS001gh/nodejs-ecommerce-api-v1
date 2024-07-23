/* eslint-disable import/extensions */
import slugify from 'slugify';
import { body, check } from 'express-validator';
import { validatorMiddleware } from '../../middlewares/validatorMiddleware.js';

export const getCategoryValidator = [
  check('id').isMongoId().withMessage('Invalid category id format'),
  validatorMiddleware,
];
export const createCategoryValidator = [
  check('name')
    .notEmpty()
    .withMessage('Category should be exist')
    .isLength({ min: 3 })
    .withMessage('Too short category name')
    .isLength({ max: 32 })
    .withMessage('Too long category name')
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];
export const updateCategoryValidator = [
  check('id').isMongoId().withMessage('Invalid category id format'),
  body('name').custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  validatorMiddleware,
];
export const deleteCategoryValidator = [
  check('id').isMongoId().withMessage('Invalid category id format'),
  validatorMiddleware,
];
