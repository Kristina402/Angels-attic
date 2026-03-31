const express = require("express");
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetails,
  createProductReview,
  getProductReviews,
  deleteReview,
  getAdminProducts,
  getVendorProducts,
  getVendorReviews,
} = require("../controller/productController");
const { isAuthentictedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.route("/product").get(getAllProducts);

router
  .route("/admin/product/new")
  .post(isAuthentictedUser, authorizeRoles("admin", "vendor"), createProduct);

router
  .route("/admin/product/:id")
  .put(isAuthentictedUser, authorizeRoles("admin", "vendor"), updateProduct)
  .delete(isAuthentictedUser, authorizeRoles("admin", "vendor"), deleteProduct);

router.route("/product/:id").get(getProductDetails);

router.route("/review/new").put(isAuthentictedUser, createProductReview);

router
  .route("/reviews")
  .get(getProductReviews)
  .delete(isAuthentictedUser, deleteReview);

router
  .route("/admin/products")
  .get(isAuthentictedUser, authorizeRoles("admin", "vendor"), getAdminProducts);

router
  .route("/vendor/products")
  .get(isAuthentictedUser, authorizeRoles("vendor"), getVendorProducts);

router
  .route("/vendor/reviews")
  .get(isAuthentictedUser, authorizeRoles("vendor"), getVendorReviews);

module.exports = router;
