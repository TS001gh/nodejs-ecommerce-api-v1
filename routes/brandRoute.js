/* eslint-disable import/extensions */
import express from "express";
// import subBrandRoute from './subBrandRoute.js';
import {
  getBrandValidator,
  createBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
} from "../utils/validators/brandValidator.js";

import {
  createBrand,
  deleteBrand,
  getBrands,
  getBrandById,
  updateBrand,
  uploadBrandImage,
  resizeImage,
} from "../services/brandService.js";

const router = express.Router();

// router.use('/:brandId/subCategories', subBrandRoute);

router
  .route("/")
  .get(getBrands)
  .post(uploadBrandImage, resizeImage, createBrandValidator, createBrand);
router
  .route("/:id")
  .get(getBrandValidator, getBrandById)
  .put(uploadBrandImage, resizeImage, updateBrandValidator, updateBrand)
  .delete(deleteBrandValidator, deleteBrand);
export default router;
