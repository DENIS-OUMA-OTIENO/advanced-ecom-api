const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");

exports.deleteOne = (Model) => async (req, res, next) => {
  const { id } = req.params;
  const document = await Model.findByIdAndDelete(id);

  if (!document) {
    return next(new ApiError(`No document with ${id} id found`, 404));
  }

  res.status(204).json({
    message: `Document with ${id} id was successfully deleted`,
    data: document,
  });
};

exports.updateOne = (Model) => async (req, res, next) => {
  const { id } = req.params;
  const document = await Model.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  if (!document) {
    return next(new ApiError(`No document with ${id} id found`, 404));
  }

  res.status(200).json({
    message: `Document with ${id} id was updated successfully`,
    data: document,
  });
};

exports.createOne = (Model) => async (req, res, next) => {
  const document = await Model.create(req.body);

  if (!document) {
    return next(new ApiError("Invalid document data", 400));
  }

  res.status(201).json({
    message: "Document created successfully",
    data: document,
  });
};

exports.getOne = (Model) => async (req, res, next) => {
  const { id } = req.params;

  const document = await Model.findById(id);

  if (!document) {
    return next(new ApiError(`No document with ${id} id found.`, 404));
  }
  res.status(200).json({ data: document });
};

exports.getAll =
  (Model, modelName = "") =>
  async (req, res, next) => {
    let filter = {};

    if (req.filterObj) {
      filter = req.filterObj;
    }

    const countDocuments = await Model.countDocuments();
    const apiFeatures = new ApiFeatures(Model.find(filter), req.query)
      .paginate(countDocuments)
      .filter()
      .sort()
      .search(modelName)
      .fieldsLimit();
      
    const { databaseQuery, paginationResult } = apiFeatures;
    const documents = await databaseQuery;

    res
      .status(200)
      .json({ results: documents.length, paginationResult, data: documents });
  };
