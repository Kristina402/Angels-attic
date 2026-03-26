const express = require("express");
const {
  newOrder,
  getSingleOrder,
  myOrders,
  getVendorOrders,
  getAllOrders,
  updateOrder,
  deleteOrder,
} = require("../controller/orderController");
const router = express.Router();

const { isAuthentictedUser, authorizeRoles } = require("../middleware/auth");

router.route("/order/new").post(isAuthentictedUser, newOrder);

router.route("/order/:id").get(isAuthentictedUser, getSingleOrder);

router.route("/orders/myOrders").get(isAuthentictedUser, myOrders);

router.route("/vendor/orders").get(isAuthentictedUser, authorizeRoles("vendor"), getVendorOrders);

router
  .route("/admin/orders")
  .get(isAuthentictedUser, authorizeRoles("admin", "vendor"), getAllOrders);

router
  .route("/admin/order/:id")
  .put(isAuthentictedUser, authorizeRoles("admin", "vendor"), updateOrder)
  .delete(isAuthentictedUser, authorizeRoles("admin", "vendor"), deleteOrder);

module.exports = router;
