/* eslint-disable import/extensions */
import express from "express";
import subCategoryRoute from "./subCategoryRoute.js";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  resizeImage,
  updateCategory,
  uploadCategoryImage,
} from "../services/categoryService.js";
import {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} from "../utils/validators/categoryValidator.js";

const router = express.Router();

router.use("/:categoryId/subCategories", subCategoryRoute);

router
  .route("/")
  .get(getCategories)
  .post(
    uploadCategoryImage,
    resizeImage,
    createCategoryValidator,
    createCategory
  );
router
  .route("/:id")
  .get(getCategoryValidator, getCategoryById)
  .put(
    uploadCategoryImage,
    resizeImage,
    updateCategoryValidator,
    updateCategory
  )
  .delete(deleteCategoryValidator, deleteCategory);
export default router;
