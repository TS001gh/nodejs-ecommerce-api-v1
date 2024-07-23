import multer from "multer";
import ApiError from "../utils/apiError.js";

const multerOptions = () => {
  const multerStorage = multer.memoryStorage();

  const multerFileFilter = function (req, file, cb) {
    //mimetype:  image/[jpg,png,gif,webp,svg,jpeg,ico]
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new ApiError("Only images allowed", 400), false);
    }
  };

  const upload = multer({
    storage: multerStorage,
    fileFilter: multerFileFilter,
  });

  return upload;
};

/**
 * @desc Upload category image middleware
 **/

export const singleImageUploader = (filedName) =>
  multerOptions().single(filedName);

/*
// 1-Disk storage engine
// const multerStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     // cb like next of express if it success will be move to next middle either there is an error will return that error
//     cb(null, "uploads/categories");
//   },
//   filename: function (req, file, cb) {
//     // category-${id}-Date.now().jpeg
//     const ext = file.mimetype.split("/")[1];
//     const filename = `category-${uuidv4()}-${Date.now()}.${ext}`;
//     cb(null, filename);
//   },
// });
*/

export const uploadMixOfImages = (arrOFFields) =>
  multerOptions().fields(arrOFFields);
