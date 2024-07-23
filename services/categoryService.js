/* eslint-disable import/no-extraneous-dependencies */
import { v4 as uuidv4 } from "uuid";
import sharp from "sharp";
import asyncHandler from "express-async-handler";
import Category from "../models/categoryModel.js";
import factory from "./handlersFactory.js";
import { singleImageUploader } from "../middlewares/uploadImageMiddleware.js";

// Name of field will come from the client side
export const uploadCategoryImage = singleImageUploader("image");

// processing image
export const resizeImage = asyncHandler(async (req, res, next) => {
  // console.log(req.file);
  if (req.file) {
    const fileName = `category-${uuidv4()}-${Date.now()}.jpeg`;
    // sharp always takes buffer to upload the image successfully
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/categories/${fileName}`);

    // save image into our db
    req.body.image = fileName;
  }

  next();
});

/**
 * @desc Get Categories
 * @route GET /api/v1/categories
 * @access Public
 */
export const getCategories = factory.getAllDocuments(Category);

/**
 * @desc Get specific category by id
 * @route GET /api/v1/categories/:id
 * @access Public
 */
export const getCategoryById = factory.getDocumentById(Category);
/**
 * @desc Create category
 * @route POST /api/v1/categories
 * @access Private
 */
export const createCategory = factory.createOne(Category);
/**
 * @desc Update specific category
 * @route PUT || UPDATE /api/v1/categories/:id
 * @access Private
 */

export const updateCategory = factory.updateOne(Category);

/**
 * @desc Delete specific category
 * @route DELETE /api/v1/categories/:id
 * @access Private
 */

export const deleteCategory = factory.deleteOne(Category);
