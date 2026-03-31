const Product = require("../models/productModel");
const User = require("../models/userModel");
const Order = require("../models/orderModel");
const Notification = require("../models/notificationModel");
const ErrorHandler = require("../utils/errorHandler");
const asyncWrapper = require("../middleware/asyncWrapper");
const ApiFeatures = require("../utils/apiFeatures");
const cloudinary = require("cloudinary");

const validateImages = (images) => {
  const allowedExtensions = ["jpg", "jpeg", "png"];
  for (let img of images) {
    if (typeof img === "string" && img.startsWith("data:image/")) {
      const mimeType = img.split(";")[0].split(":")[1];
      const extension = mimeType.split("/")[1];
      if (!allowedExtensions.includes(extension)) {
        return false;
      }
    }
  }
  return true;
};

// Create Product -- Admin
exports.createProduct = asyncWrapper(async (req, res, next) => {
  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  if (images.length === 0) {
    return next(new ErrorHandler("Please Upload Product Images", 400));
  }

  if (!validateImages(images)) {
    return next(new ErrorHandler("Only JPG, JPEG, and PNG formats are allowed", 400));
  }

  const imagesLinks = [];

  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: "products",
    });

    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

  req.body.images = imagesLinks;
  req.body.user = req.user.id;

  // All products (admin or vendor) are approved immediately
  req.body.isApproved = true;

  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product,
  });
});

// Get All Product
exports.getAllProducts = asyncWrapper(async (req, res, next) => {
  const resultPerPage = 8;
  const productsCount = await Product.countDocuments({ isApproved: true });

  // For public view, we only show approved products
  const apiFeature = new ApiFeatures(Product.find({ isApproved: true }), req.query)
    .search()
    .filter()
    .sort();

  let products = await apiFeature.query;

  let filteredProductsCount = products.length;

  apiFeature.Pagination(resultPerPage);

  products = await apiFeature.query.clone();

  res.status(200).json({
    success: true,
    products,
    productsCount,
    resultPerPage,
    filteredProductsCount,
  });
});

// Get Product Details
exports.getProductDetails = asyncWrapper(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  let canReview = false;
  if (req.user) {
    const order = await Order.findOne({
      user: req.user._id,
      "orderItems.productId": product._id,
      orderStatus: "Delivered",
    });
    if (order) {
      canReview = true;
    }
  }

  res.status(200).json({
    success: true,
    product,
    canReview,
  });
});

// Update Product -- Admin/Vendor
exports.updateProduct = asyncWrapper(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  // Check ownership if vendor
  if (req.user.role === "vendor" && product.user.toString() !== req.user.id) {
    return next(new ErrorHandler("You are not allowed to update this product", 403));
  }

  // Images Start Here
  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  if (images !== undefined && images.length > 0) {
    if (!validateImages(images)) {
      return next(new ErrorHandler("Only JPG, JPEG, and PNG formats are allowed", 400));
    }
    // Deleting Images From Cloudinary
    for (let i = 0; i < product.images.length; i++) {
      await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }

    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.images = imagesLinks;
  }

  const oldApproved = product.isApproved;
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  // If status changed, notify the vendor
  if (req.user.role === "admin" && oldApproved !== product.isApproved) {
    await Notification.create({
      recipient: product.user,
      message: `Your product "${product.name}" has been ${product.isApproved ? "approved" : "disapproved"} by an admin.`,
      type: "product_approval",
      link: `/vendor/products`,
    });
  }

  res.status(200).json({
    success: true,
    product,
  });
});

// Delete Product -- Admin/Vendor
exports.deleteProduct = asyncWrapper(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  // Check ownership if vendor
  if (req.user.role === "vendor" && product.user.toString() !== req.user.id) {
    return next(new ErrorHandler("You are not allowed to delete this product", 403));
  }

  // Deleting Images From Cloudinary
  for (let i = 0; i < product.images.length; i++) {
    await cloudinary.v2.uploader.destroy(product.images[i].public_id);
  }

  await product.remove();

  res.status(200).json({
    success: true,
    message: "Product Delete Successfully",
  });
});

// Create New Review or Update the review
exports.createProductReview = asyncWrapper(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  // Check if user has purchased and received the product
  const order = await Order.findOne({
    user: req.user._id,
    "orderItems.productId": productId,
    orderStatus: "Delivered",
  });

  if (!order) {
    return next(new ErrorHandler("You can only review products you have purchased and received", 400));
  }

  const product = await Product.findById(productId);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const review = {
    user: req.user._id,
    order: order._id,
    vendor: product.user, // Directly linking the review with the product's vendor
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  // Check if the user already reviewed this product.
  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString()) {
        rev.rating = rating;
        rev.comment = comment;
        rev.order = order._id;
      }
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  let avg = 0;
  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });

  product.ratings = avg / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

// Get All Reviews of a product
exports.getProductReviews = asyncWrapper(async (req, res, next) => {
  const product = await Product.findById(req.query.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  // If user is logged in, check role for vendor restriction
  // Note: This route is used by ProductDetails (public) and Admin/ProductReviews
  // For Admin/Vendor, we might want more restriction if called via the dashboard
  if (req.user && req.user.role === "vendor") {
    if (product.user.toString() !== req.user.id) {
      return next(new ErrorHandler("You can only view reviews for your own products", 403));
    }
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

// Delete Review
exports.deleteReview = asyncWrapper(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const reviewToDelete = product.reviews.find(
    (rev) => rev._id.toString() === req.query.id.toString()
  );

  if (!reviewToDelete) {
    return next(new ErrorHandler("Review not found", 404));
  }

  // Check if user is Admin OR the author of the review
  if (req.user.role !== "admin" && reviewToDelete.user.toString() !== req.user.id) {
    return next(new ErrorHandler("You are not allowed to delete this review", 403));
  }

  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );

  let avg = 0;
  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  let ratings = 0;
  if (reviews.length === 0) {
    ratings = 0;
  } else {
    ratings = avg / reviews.length;
  }

  const numOfReviews = reviews.length;

  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
  });
});

// Get All Product (Admin/Vendor)
exports.getAdminProducts = asyncWrapper(async (req, res, next) => {
  let products;
  if (req.user.role === "admin") {
    products = await Product.find();
  } else if (req.user.role === "vendor") {
    products = await Product.find({ user: req.user._id });
  }

  res.status(200).json({
    success: true,
    products,
  });
});

// Get Vendor Products
exports.getVendorProducts = asyncWrapper(async (req, res, next) => {
  const products = await Product.find({ user: req.user._id });

  res.status(200).json({
    success: true,
    products,
  });
});

// Get All Reviews for a Vendor's Products
exports.getVendorReviews = asyncWrapper(async (req, res, next) => {
  // Use aggregation to find all reviews across all products that belong to this vendor
  // This is more performant than fetching all products and manually filtering
  const reviews = await Product.aggregate([
    { $match: { user: req.user._id } },
    { $unwind: "$reviews" },
    {
      $project: {
        _id: "$reviews._id",
        productId: "$_id",
        productName: "$name",
        user: "$reviews.user",
        name: "$reviews.name",
        rating: "$reviews.rating",
        comment: "$reviews.comment",
        order: "$reviews.order",
        vendor: "$reviews.vendor",
      },
    },
  ]);

  res.status(200).json({
    success: true,
    reviews,
  });
});
