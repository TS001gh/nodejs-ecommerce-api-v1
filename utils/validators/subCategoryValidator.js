/* eslint-disable import/prefer-default-export */
/* eslint-disable import/extensions */
import slugify from 'slugify';
import { body, check } from 'express-validator';
import { validatorMiddleware } from '../../middlewares/validatorMiddleware.js';
import Category from '../../models/categoryModel.js';
import ApiError from '../apiError.js';

export const getSubCategoryValidator = [
  check('id').isMongoId().withMessage('Invalid subCategory id format'),
  validatorMiddleware,
];
export const createSubCategoryValidator = [
  check('name')
    .notEmpty()
    .withMessage('SubCategory should be exist')
    .isLength({ min: 2 })
    .withMessage('Too short subCategory name')
    .isLength({ max: 32 })
    .withMessage('Too long subCategory name')
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check('category')
    .notEmpty()
    .withMessage('subCategory must be belong to category')
    .isMongoId()
    .withMessage('Invalid Category id format')
    .custom(async (val) => {
      //   check if category is occur in category or not
      if (val) {
        const cat = await Category.findOne({ _id: val });
        if (!cat) {
          throw new Error('This category id does not exist', 400);
        }
      }
    }),
  validatorMiddleware,
];
export const updateSubCategoryValidator = [
  check('id').isMongoId().withMessage('Invalid subCategory id format'),
  body('name').custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  check('category')
    .isMongoId()
    .withMessage('Invalid Category id format')
    .custom(async (val) => {
      //   check if category is occur in category or not
      if (val) {
        const cat = await Category.findOne({ _id: val });
        if (!cat) {
          throw new Error('This category id does not exist', 400);
        }
      }
    })
    .optional(),
  validatorMiddleware,
];
export const deleteSubCategoryValidator = [
  check('id').isMongoId().withMessage('Invalid subCategory id format'),
  validatorMiddleware,
];
