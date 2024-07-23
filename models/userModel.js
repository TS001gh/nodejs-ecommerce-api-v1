import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Name Is Required"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "Email Is Required"],
      unique: true,
      lowercase: true,
    },

    phone: String,
    profileImg: String,

    password: {
      type: String,
      required: [true, "Password Is Required"],
      min: [6, "Too short password"],
    },

    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const setImageUrl = function (doc) {
  if (doc.profileImg) {
    const imageUrl = `${process.env.BASE_URL}/users/${doc.profileImg}`;
    doc.profileImg = imageUrl;
  }
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  // Hashing user password
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// This will trigger when so these actions like (find, update)
userSchema.post("init", function (doc) {
  // return Image base url + image name
  setImageUrl(doc);
});

// This will be trigger when we create a new document inside our db
userSchema.post("save", function (doc) {
  // return Image base url + image name
  setImageUrl(doc);
});

const User = mongoose.model("User", userSchema);

export default User;
