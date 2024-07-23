import mongoose from "mongoose";
import { deleteImages } from "../utils/deleteImages.js";

// 1- Create Schema
const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      unique: [true, "Product name must be unique"],
      minlength: [3, "Too short product title"],
      maxlength: [100, "Too long product title"],
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      minlength: [20, "Too short product description"],
    },
    quantity: {
      type: Number,
      required: [true, "Product quantity is required"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      trim: true,
      max: [200000, "Too long product price"],
    },
    priceAfterDiscount: {
      type: Number,
    },
    colors: [String],

    imageCover: {
      type: String,
      required: [true, "Product Image cover is required"],
    },
    images: [String],
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "Product must be belong to category"],
    },
    subcategories: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "SubCategory",
      },
    ],
    brand: {
      type: mongoose.Schema.ObjectId,
      ref: "Brand",
    },
    ratingsAverage: {
      type: Number,
      min: [1, "Rating must be above or equal 1.0"],
      max: [5, "Rating must be below or equal 5.0"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Mongoose query middleware
productSchema.pre(/^find/, function (next) {
  this.populate({
    path: "category",
    select: "name",
  });
  next();
});

const setImageUrl = function (doc) {
  if (doc.imageCover) {
    const imageUrl = `${process.env.BASE_URL}/products/${doc.imageCover}`;
    doc.imageCover = imageUrl;
  }
  if (doc.images) {
    const imagesList = [];
    doc.images.forEach((image, idx) => {
      const imageUrl = `${process.env.BASE_URL}/products/${image}`;
      imagesList.push(imageUrl);
    });

    doc.images = imagesList;
  }
};

// This will trigger when so these actions like (find, update)
productSchema.post("init", function (doc) {
  // return Image base url + image name
  setImageUrl(doc);
});

// This will be trigger when we create a new document inside our db
productSchema.post("save", function (doc) {
  // return Image base url + image name
  setImageUrl(doc);
});

productSchema.pre("findOneAndUpdate", async function (next) {
  try {
    const update = this._update;

    if (update.imageCover || update.images) {
      const imagesLength = update.images?.length;
      const imageCoverLength = update?.imageCover;

      const docToUpdate = await this.model.findOne(this.getQuery());
      if (docToUpdate) {
        await deleteImages.bind(
          null,
          docToUpdate,
          imagesLength,
          imageCoverLength
        )();
      }
    }
    next();
  } catch (error) {
    console.error("Error occurred:", error);
  }
});

// 2- Create Model
const Product = mongoose.model("Product", productSchema);

export default Product;
