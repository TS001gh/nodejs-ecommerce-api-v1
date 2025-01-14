import mongoose from 'mongoose';

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: [true, 'SubCategory must be unique'],
      minlength: [2, 'Too short SubCategory name'],
      maxlength: [32, 'Too long SubCategory name'],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: 'Category',
      require: [true, 'SubCategory must be belong to parent category'],
    },
  },
  { timestamps: true }
);

subCategorySchema.pre(/^find/, function (next) {
  this.populate({
    path: 'category',
    select: 'name',
  });
  next();
});

const SubCategory = mongoose.model('SubCategory', subCategorySchema);
export default SubCategory;
