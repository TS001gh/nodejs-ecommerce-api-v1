import fs from "fs";
import ApiError from "./apiError.js";

export const deleteImages = async (
  document,
  imagesLength = 0,
  imageCoverLength = ""
) => {
  let imagePath =
    (imageCoverLength !== "" && document.imageCover) || document.image;
  console.log("image path: ", imagePath);
  if (imagePath) {
    imagePath = imagePath.split("http://localhost:8000/")[1];
    fs.unlink(`uploads/${imagePath}`, function (err) {
      if (err)
        throw new ApiError("Error was occurred while deleting the image", 500);
      console.log("image deleted successfully.");
    });
  }

  if (document.images?.length > 0 && imagesLength > 0) {
    document.images.forEach((productImage) => {
      const imagePath = productImage.split("http://localhost:8000/")[1];
      fs.unlink(`uploads/${imagePath}`, function (err) {
        if (err)
          throw new ApiError(
            "Error was occurred while deleting the image",
            500
          );
        console.log("image deleted successfully.");
      });
    });
  }
};
