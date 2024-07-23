import asyncHandler from "express-async-handler";
import ApiError from "../utils/apiError.js";

export const productAdaptorMiddleware = asyncHandler((req, res, next) => {
  try {
    if (req.body.colors) {
      const elements = operation(req.body.colors);
      req.body.colors = elements;
    }
    if (req.body.subcategories) {
      const elements = operation(req.body.subcategories);
      req.body.subcategories = elements;
    }

    next();
  } catch (error) {
    next(new ApiError("Error was occurred because: " + error.message, 500));
  }
});

function operation(arr) {
  const value = String(arr);
  const result =
    (value.startsWith('"[') && value.endsWith(']"')) ||
    (value.startsWith("[") && value.endsWith("]"))
      ? value
          .replace(/"/g, "")
          .replace(/'/g, "")
          .slice(1, -1)
          .split(", ")
          .join(",")
      : value.replace(/"/g, "").replace(/'/g, "").split(", ").join(",");
  const elements = result.split(",");
  return elements;
}
