const Post = require("../modals/Post");
const asyncHandler = require("../middleware/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");

exports.getAllPosts = asyncHandler(async (req, res, next) => {
  let query;
  let uiValues = {
    filtering: {},
    sorting: {},
  };

  const reqQuery = { ...req.query };
  const removeFields = ["sort"];
  removeFields.forEach((param) => delete reqQuery[param]);

  const filterKeys = Object.keys(reqQuery);
  const filterValues = Object.values(reqQuery);
  filterKeys.forEach(
    (value, index) => (uiValues.filtering[value] = filterValues[index])
  );

  let queryStr = JSON.stringify(reqQuery);
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `${match}`);

  query = Post.find(JSON.parse(queryStr));
  if (req.query.sort) {
    const sortByArr = req.query.sort.split(",");
    sortByArr.forEach((val) => {
      let order;
      if (val[0] === "-") {
        order = "descending";
      } else {
        order = "ascending";
      }
      uiValues.sorting[val.replace("-", "")] = order;
    });
    const sortByStr = sortByArr.join(" ");
    query = query.sort(sortByStr);
  } else {
    query = query.sort("-price");
  }

  const posts = await query;
  const maxPrice = await Post.find()
    .sort({ price: -1 })
    .limit(1)
    .select("-_id price");
  const minPrice = await Post.find()
    .sort({ price: 1 })
    .limit(1)
    .select("-_id price");
  uiValues.maxPrice = maxPrice[0].price;
  uiValues.minPrice = minPrice[0].price;

  res.status(200).json({
    success: true,
    data: posts,
    uiValues,
  });
});

exports.createPost = asyncHandler(async (req, res, next) => {
  const post = await Post.create(req.body);
  res.status(201).json({
    success: true,
    data: post,
  });
});

exports.getPostById = asyncHandler(async (req, res, next) => {
  let post = await Post.findById(req.params.id);
  if (!post) {
    return next(
      new ErrorResponse(`Post with id ${req.params.id} not found`),
      404
    );
  }
  res.status(200).json({
    success: true,
    data: post,
  });
});

exports.updatePostById = asyncHandler(async (req, res, next) => {
  let post = await Post.findById(req.params.id);
  if (!post) {
    return next(
      new ErrorResponse(`Post with id ${req.params.id} not found`),
      404
    );
  }

  post = await Post.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(201).json({
    success: true,
    data: post,
  });
});

exports.deletePostById = asyncHandler(async (req, res, next) => {
  let post = await Post.findById(req.params.id);
  if (!post) {
    return next(
      new ErrorResponse(`Post with id ${req.params.id} not found`),
      404
    );
  }

  await post.remove();
  res.status(200).json({
    success: true,
    data: {},
  });
});
