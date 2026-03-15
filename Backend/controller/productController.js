const Product = require("../model/productModel");
const ErrorHandler = require("../utils/errorHandler");
const asyncWrapper = require("../middleWare/asyncWrapper");
const ApiFeatures = require("../utils/apiFeatures");
const cloudinary = require("cloudinary");

// Create Product -- Admin
exports.createProduct = asyncWrapper(async (req, res, next) => {
  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
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

  // Vendors' products need approval, admins' don't
  if (req.user.role === "vendor") {
    req.body.isApproved = false;
  } else {
    req.body.isApproved = true;
  }

  const product = await Product.create(req.body);

  // If vendor, notify admins
  if (req.user.role === "vendor") {
    const admins = await User.find({ role: "admin" });
    for (const admin of admins) {
      await Notification.create({
        recipient: admin._id,
        message: `New product submission from vendor: ${product.name}`,
        type: "product_approval",
        link: `/admin/product/${product._id}`,
      });
    }
  }

  res.status(201).json({
    success: true,
    product,
  });
});

// Get All Product
exports.getAllProducts = asyncWrapper(async (req, res, next) => {
  const resultPerPage = 8;
  const productsCount = await Product.countDocuments();

  // For public view, we might want to filter Available items only, 
  // but let's keep it flexible so frontend can decide how to show Sold items.
  const apiFeature = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter();

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

  res.status(200).json({
    success: true,
    product,
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

  if (images !== undefined) {
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

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);

  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString())
        (rev.rating = rating), (rev.comment = comment);
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
