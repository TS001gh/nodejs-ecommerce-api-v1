import mongoose from "mongoose";
import { deleteImages } from "../utils/deleteImages.js";

// 1- Create Schema
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category is required"],
      unique: [true, "Category must be unique"],
      min: [3, "Too short Category name"],
      max: [32, "Too long Category name"],
    },
    // A and B => a-and-b
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true }
);

const setImageUrl = function (doc) {
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/categories/${doc.image}`;
    doc.image = imageUrl;
  }
};

// This will trigger when so these actions like (find, update)
categorySchema.post("init", function (doc) {
  // return Image base url + image name
  setImageUrl(doc);
});

// This will be trigger when we create a new document inside our db
categorySchema.post("save", function (doc) {
  // return Image base url + image name
  setImageUrl(doc);
});

categorySchema.pre("findOneAndUpdate", async function (next) {
  try {
    const update = this._update;

    if (update.image) {
      const docToUpdate = await this.model.findOne(this.getQuery());
      if (docToUpdate) {
        await deleteImages.bind(null, docToUpdate)();
      }
    }
    next();
  } catch (error) {
    console.error("Error occurred:", error);
  }
});

// 2- Create Model
const Category = mongoose.model("Category", categorySchema);

export default Category;
