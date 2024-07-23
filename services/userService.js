import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import { singleImageUploader } from "../middlewares/uploadImageMiddleware.js";
import User from "../models/userModel.js";
import factory from "./handlersFactory.js";
import asyncHandler from "express-async-handler";

// Name of field will come from the client side
export const uploadUserImage = singleImageUploader("profileImg");

// processing image
export const resizeImage = asyncHandler(async (req, res, next) => {
  // console.log(req.file);
  if (req.file) {
    const fileName = `user-${uuidv4()}-${Date.now()}.jpeg`;
    // sharp always takes buffer to upload the image successfully
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/users/${fileName}`);

    // save image into our db
    req.body.profileImg = fileName;
  }
  next();
});

/**
 * @desc Get Users
 * @route GET /api/v1/users
 * @access Private
 */
export const getUsers = factory.getAllDocuments(User);

/**
 * @desc Get specific user by id
 * @route GET /api/v1/users/:id
 * @access Private
 */
export const getUserById = factory.getDocumentById(User);

/**
 * @desc Create user
 * @route POST /api/v1/users
 * @access Private
 */
export const createUser = factory.createOne(User);

/**
 * @desc Update specific user
 * @route PUT || UPDATE /api/v1/users/:id
 * @access Private
 */

export const updateUser = asyncHandler(async function (req, res) {
  const { id } = req.params;

  const document = await User.findByIdAndUpdate(
    id,
    {
      name: req.body.name,
      slug: req.body.slug,
      phone: req.body.phone,
      email: req.body.email,
      profileImg: req.body.profileImg,
      role: req.body.role,
    },
    { new: true } // Return the document after updating not before updating
  ).select("-__v");

  if (!document) {
    return next(new ApiError(`No document found for this id ${id}`, 404));
  }

  res.status(200).json({ success: true, document });
});

/**
 * @desc Update specific user password
 * @route PUT || UPDATE /api/v1/users/password/:id
 * @access Private
 */
export const changeUserPassword = asyncHandler(async function (req, res) {
  const { id } = req.params;
  let { password } = req.body;
  password = await bcrypt.hash(password, 12);

  const document = await User.findByIdAndUpdate(
    id,
    {
      password,
    },
    { new: true } // Return the document after updating not before updating
  ).select("-__v");

  if (!document) {
    return next(new ApiError(`No document found for this id ${id}`, 404));
  }

  res.status(200).json({ success: true, document });
});

/**
 * @desc Delete specific user
 * @route DELETE /api/v1/users/:id
 * @access Private
 */

export const deleteUser = asyncHandler(async function (req, res) {
  const { id } = req.params;

  const document = await User.findOneAndUpdate(
    { _id: id },
    { active: false },
    { new: true } // Return the document after updating not before updating
  ).select("-__v");

  if (!document) {
    return next(new ApiError(`No document found for this id ${id}`, 404));
  }

  res.status(200).json({ success: true, document });
});
