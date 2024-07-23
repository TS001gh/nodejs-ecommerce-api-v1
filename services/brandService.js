import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
import { singleImageUploader } from "../middlewares/uploadImageMiddleware.js";
import Brand from "../models/brandModel.js";
import factory from "./handlersFactory.js";
import asyncHandler from "express-async-handler";

// Name of field will come from the client side
export const uploadBrandImage = singleImageUploader("image");

// processing image
export const resizeImage = asyncHandler(async (req, res, next) => {
  // console.log(req.file);
  if (req.file) {
    const fileName = `brand-${uuidv4()}-${Date.now()}.jpeg`;
    // sharp always takes buffer to upload the image successfully
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/brands/${fileName}`);

    // save image into our db
    req.body.image = fileName;
  }

  next();
});

/**
 * @desc Get Brands
 * @route GET /api/v1/brands
 * @access Public
 */
export const getBrands = factory.getAllDocuments(Brand);

/**
 * @desc Get specific brand by id
 * @route GET /api/v1/brands/:id
 * @access Public
 */
export const getBrandById = factory.getDocumentById(Brand);

/**
 * @desc Create brand
 * @route POST /api/v1/brands
 * @access Private
 */
export const createBrand = factory.createOne(Brand);

/**
 * @desc Update specific brand
 * @route PUT || UPDATE /api/v1/brands/:id
 * @access Private
 */

export const updateBrand = factory.updateOne(Brand);

/**
 * @desc Delete specific brand
 * @route DELETE /api/v1/brands/:id
 * @access Private
 */

export const deleteBrand = factory.deleteOne(Brand);
