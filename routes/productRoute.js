/* eslint-disable import/extensions */
import express from "express";

import {
  createProduct,
  deleteProduct,
  getProducts,
  getProductById,
  updateProduct,
  uploadProductImages,
  resizeProductImages,
} from "../services/productService.js";
import {
  getProductValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
} from "../utils/validators/productValidator.js";
import { productAdaptorMiddleware } from "../middlewares/productAdaptorMiddleware.js";
const router = express.Router();

router
  .route("/")
  .get(getProducts)
  .post(
    uploadProductImages,
    resizeProductImages,
    productAdaptorMiddleware,
    createProductValidator,
    createProduct
  );
router
  .route("/:id")
  .get(getProductValidator, getProductById)
  .put(
    uploadProductImages,
    resizeProductImages,
    productAdaptorMiddleware,
    updateProductValidator,
    updateProduct
  )
  .delete(deleteProductValidator, deleteProduct);

export default router;
