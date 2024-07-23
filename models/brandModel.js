import mongoose from "mongoose";
import { deleteImages } from "../utils/deleteImages.js";

// 1- Create Schema
const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Brand is required"],
      unique: [true, "Brand must be unique"],
      minlength: [3, "Too short Brand name"],
      maxlength: [32, "Too long Brand name"],
    },
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
    const imageUrl = `${process.env.BASE_URL}/brands/${doc.image}`;
    doc.image = imageUrl;
  }
};

// This will trigger when so these actions like (find, update)
brandSchema.post("init", function (doc) {
  // return Image base url + image name
  setImageUrl(doc);
});

// This will be trigger when we create a new document inside our db
brandSchema.post("save", function (doc) {
  // return Image base url + image name
  setImageUrl(doc);
});

brandSchema.pre("findOneAndUpdate", async function (next) {
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
const Brand = mongoose.model("Brand", brandSchema);

export default Brand;
