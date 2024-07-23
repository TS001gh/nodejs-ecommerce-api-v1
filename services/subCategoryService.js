/* eslint-disable import/prefer-default-export */
import SubCategory from "../models/subCategoryModel.js";
import factory from "./handlersFactory.js";

export const categoryIdToBody = (req, res, next) => {
  // Nested Route
  // Check if category exists in url param and set it to body if doesn't exist in body
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};

// Nested Route
// To get all subcategories for a given route parameter (The categoryId)
// GET / /api/v1/categories/:categoryId/subcategories
export const createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryId) filterObject = { category: req.params.categoryId };
  req.filterObject = filterObject;
  next();
};

/**
 * @desc Get SubCategories
 * @route GET /api/v1/subCategories
 * @access Public
 */
export const getSubCategories = factory.getAllDocuments(SubCategory);

/**
 * @desc Get specific SubCategory by id
 * @route GET /api/v1/subCategories/:id
 * @access Public
 */
export const getSubCategoryById = factory.getDocumentById(SubCategory);

/**
 * @desc Create subCategory
 * @route POST /api/v1/subCategories
 * @access Private
 */

export const createSubCategory = factory.createOne(SubCategory);

/**
 * @desc Update specific category
 * @route PUT || UPDATE /api/v1/categories/:id
 * @access Private
 */

export const updateSubCategory = factory.updateOne(SubCategory);

/**
 * @desc Delete specific subCategory
 * @route DELETE /api/v1/subCategories/:id
 * @access Private
 */

export const deleteSubCategory = factory.deleteOne(SubCategory);
