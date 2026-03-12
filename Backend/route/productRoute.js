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
} = require("../controller/productController");
const { isAuthentictedUser, authorizeRoles } = require("../middleWare/auth");

const router = express.Router();

router.route("/product").get(getAllProducts);

router
  .route("/admin/product/new")
  .post(isAuthentictedUser, authorizeRoles("admin"), createProduct);

router
  .route("/admin/product/:id")
  .put(isAuthentictedUser, authorizeRoles("admin"), updateProduct)
  .delete(isAuthentictedUser, authorizeRoles("admin"), deleteProduct);

router.route("/product/:id").get(getProductDetails);

router.route("/review/new").put(isAuthentictedUser, createProductReview);

router
  .route("/reviews")
  .get(getProductReviews)
  .delete(isAuthentictedUser, deleteReview);

router
  .route("/admin/products")
  .get(isAuthentictedUser, authorizeRoles("admin"), getAdminProducts);

router
  .route("/vendor/products")
  .get(isAuthentictedUser, authorizeRoles("vendor"), getVendorProducts);

module.exports = router;
