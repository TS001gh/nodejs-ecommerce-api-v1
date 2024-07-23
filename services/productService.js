import Product from "../models/productModel.js";
import factory from "./handlersFactory.js";
import asyncHandler from "express-async-handler";
import sharp from "sharp";
import { uploadMixOfImages } from "../middlewares/uploadImageMiddleware.js";
import { v4 as uuidv4 } from "uuid";

export const uploadProductImages = uploadMixOfImages([
  {
    name: "imageCover",
    maxCount: 1,
  },
  {
    name: "images",
    maxCount: 5,
  },
]);

export const resizeProductImages = asyncHandler(async (req, res, next) => {
  //   console.log(req.files);

  const imageCoverName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;
  //1- Image processing for image cover
  if (req.files.imageCover) {
    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1330)
      .toFormat("jpeg")
      .jpeg({ quality: 100 })
      .toFile(`uploads/products/${imageCoverName}`);

    //   Save image cover to db
    req.body.imageCover = imageCoverName;
  }

  //   2- Image processing for images
  if (req.files.images) {
    req.body.images = [];
    // console.log("length: ", req.files.images.length);

    // من اجل عدم الانتقال للخطوة التالية من الكود انتظر الى ان ينتهي هذا
    await Promise.all(
      req.files.images.map(async (image, idx) => {
        const singleImageName = `product-${uuidv4()}-${Date.now()}-${
          idx + 1
        }.jpeg`;

        await sharp(image.buffer)
          .resize(600, 600)
          .toFormat("jpeg")
          .jpeg({ quality: 100 })
          .toFile(`uploads/products/${singleImageName}`);

        req.body.images.push(singleImageName);
      })
    );
    // console.log(req.body.imageCover, req.body.images);
  }
  next();
});

/**
 * @desc Get Products
 * @route GET /api/v1/products
 * @access Public
 */
export const getProducts = factory.getAllDocuments(Product);
/**
 * @desc Get specific product by id
 * @route GET /api/v1/products/:id
 * @access Public
 */
export const getProductById = factory.getDocumentById(Product);

/**
 * @desc Create product
 * @route POST /api/v1/products
 * @access Private
 */
export const createProduct = factory.createOne(Product);

/**
 * @desc Update specific product
 * @route PUT || UPDATE /api/v1/products/:id
 * @access Private
 */

export const updateProduct = factory.updateOne(Product);
/**
 * @desc Delete specific product
 * @route DELETE /api/v1/products/:id
 * @access Private
 */

export const deleteProduct = factory.deleteOne(Product);
