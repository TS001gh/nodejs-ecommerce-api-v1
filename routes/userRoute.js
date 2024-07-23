/* eslint-disable import/extensions */
import express from "express";
// import subUserRoute from './subUserRoute.js';
// import {
//   getUserValidator,
//   createUserValidator,
//   updateUserValidator,
//   deleteUserValidator,
// } from "../utils/validators/userValidator.js";

import {
  createUser,
  deleteUser,
  getUsers,
  getUserById,
  updateUser,
  uploadUserImage,
  resizeImage,
  changeUserPassword,
} from "../services/userService.js";
import {
  createUserValidator,
  deleteUserValidator,
  updateUserValidator,
} from "../utils/validators/userValidator.js";

const router = express.Router();

// router.use('/:userId/subCategories', subUserRoute);

router
  .route("/")
  .get(getUsers)
  .post(uploadUserImage, resizeImage, createUserValidator, createUser);
router
  .route("/:id")
  .get(getUserById)
  .put(uploadUserImage, resizeImage, updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);

router.put("/password/:id", changeUserPassword);
export default router;
