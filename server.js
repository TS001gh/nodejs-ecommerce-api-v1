/* eslint-disable import/extensions */
import path, { dirname } from "path";
import { fileURLToPath } from "url";

import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";

// Routes
import categoryRoute from "./routes/categoryRoute.js";
import subCategoryRoute from "./routes/subCategoryRoute.js";
import brandRoute from "./routes/brandRoute.js";
import productRoute from "./routes/productRoute.js";
import userRoute from "./routes/userRoute.js";

import ApiError from "./utils/apiError.js";
import { globalError } from "./middlewares/errorMiddleware.js";
import dbConnection from "./config/database.js";

dotenv.config({ path: "config.env" });

const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to db
dbConnection();

// express app
const app = express();

// middlewares
app.use(express.json());
// for send the image correctly to client side
// do serve for files inside the upload folder
// Ex: in example i didn't write upload in url because i have written in bottom
// http://localhost:8000/categories/category-14e54687-97c8-492e-9036-af90bd6caa9f-1713559485820.jpeg
app.use(express.static(path.join(__dirname, "uploads")));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

// Mount Routes
app.use("/api/v1/categories", categoryRoute);
app.use("/api/v1/subcategories", subCategoryRoute);
app.use("/api/v1/brands", brandRoute);
app.use("/api/v1/products", productRoute);
app.use("/api/v1/users", userRoute);

app.all("*", (req, res, next) => {
  next(new ApiError(`Not found - ${req.originalUrl}`, 400));
});

// Global Error Handling middleware for express
app.use(globalError);

const server = app.listen(PORT, () => {
  console.log(`App running successfully On Port ${PORT}`);
});

// Handle rejections outside express
// catch errors that happen outside of express
process.on("unhandledRejection", (err) => {
  console.error(`UnhandledRejection Error: ${err.name} | ${err.message}`);

  // if we closed the app before closing all the requests that happened before , that a bad way .
  server.close(() => {
    console.error("Shutting down...");
    // exit of app when happened closing to the server
    process.exit(1);
  });
});
