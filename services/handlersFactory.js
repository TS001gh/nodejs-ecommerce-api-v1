import asyncHandler from "express-async-handler";
import ApiError from "../utils/apiError.js";
import ApiFeatures from "../utils/apiFeatures.js";
import { deleteImages } from "../utils/deleteImages.js";

const getAllDocuments = (Model) =>
  asyncHandler(async (req, res) => {
    // First check if filter object has sent from the service or not
    // The mission of this to get all documents that are rely to the parent like {category have many of subcategories}
    let filter = {};
    if (req.filterObject) filter = req.filterObject;

    // Get name of model for send to search method
    const { modelName } = Model;

    // Build query
    const documentsCount = await Model.countDocuments(filter);
    const apiFeatures = new ApiFeatures(Model.find(filter), req.query)
      .paginate(documentsCount)
      .filter()
      .search(modelName)
      .limitFields()
      .sort();

    // Execute the query
    const { mongooseQuery, paginationResult } = apiFeatures;
    const documents = await mongooseQuery;

    if (documents.length === 0)
      return res.status(404).json({ message: "No documents found" });
    // return success result
    res.status(200).json({
      success: true,
      results: documents.length,
      paginationResult,
      data: documents,
    });
  });

const getDocumentById = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findById(id).select("-__v");
    // .populate({ path: 'category', select: 'name -_id' });
    if (!document) {
      return next(new ApiError(`No document found for this id ${id}`, 404));
    }
    res.status(200).json({ success: true, data: document });
  });

const createOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    // return;

    try {
      const newDocument = await Model.create(req.body);
      res.status(201).json(newDocument);
    } catch (error) {
      if (error.code === 11000) {
        return next(new ApiError("Document must be unique", 404));
      }
      next(error);
    }
  });

const deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const document = await Model.findByIdAndDelete(id);

    if (!document) {
      return next(new ApiError(`No document found for this id ${id}`, 404));
    }
    await deleteImages.bind(null, document)();

    res.status(204).send({ success: true });
  });

const updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    //     const { name } = req.body;

    // filtration _ props that we will update _ options
    const document = await Model.findOneAndUpdate(
      { _id: id },
      req.body,
      { new: true } // Return the document after updating not before updating
    ).select("-__v"); // Exclude the __v field

    if (!document) {
      return next(new ApiError(`No document found for this id ${id}`, 404));
    }

    res.status(200).json({ success: true, document });
  });

export default {
  deleteOne,
  updateOne,
  createOne,
  getDocumentById,
  getAllDocuments,
};
