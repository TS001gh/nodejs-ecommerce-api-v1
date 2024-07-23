/* eslint-disable import/extensions */
import express from 'express';
import {
  createSubCategory,
  deleteSubCategory,
  getSubCategories,
  getSubCategoryById,
  updateSubCategory,
  categoryIdToBody,
  createFilterObj,
} from '../services/subCategoryService.js';
import {
  getSubCategoryValidator,
  createSubCategoryValidator,
  deleteSubCategoryValidator,
  updateSubCategoryValidator,
} from '../utils/validators/subCategoryValidator.js';

// mergeParams : allow us to access parameters on other routers
// ex: we need to access categoryId from category router
const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(createFilterObj, getSubCategories)
  .post(categoryIdToBody, createSubCategoryValidator, createSubCategory);
router
  .route('/:id')
  .get(getSubCategoryValidator, getSubCategoryById)
  .put(updateSubCategoryValidator, updateSubCategory)
  .delete(deleteSubCategoryValidator, deleteSubCategory);

export default router;
