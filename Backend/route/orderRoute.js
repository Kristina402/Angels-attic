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

const { isAuthentictedUser, authorizeRoles } = require("../middleWare/auth");

router.route("/order/new").post(isAuthentictedUser, newOrder);

router.route("/order/:id").get(isAuthentictedUser, getSingleOrder);

router.route("/orders/myOrders").get(isAuthentictedUser, myOrders);

router.route("/vendor/orders").get(isAuthentictedUser, authorizeRoles("vendor"), getVendorOrders);

router
  .route("/admin/orders")
  .get(isAuthentictedUser, authorizeRoles("admin"), getAllOrders);

router
  .route("/admin/order/:id")
  .put(isAuthentictedUser, authorizeRoles("admin"), updateOrder)
  .delete(isAuthentictedUser, authorizeRoles("admin"), deleteOrder);

module.exports = router;
