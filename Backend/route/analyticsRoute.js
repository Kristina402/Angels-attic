const express = require("express");
const { getVendorSalesAnalytics } = require("../controller/analyticsController");
const { isAuthentictedUser, authorizeRoles } = require("../middleWare/auth");

const router = express.Router();

router
  .route("/vendor/analytics")
  .get(isAuthentictedUser, authorizeRoles("vendor"), getVendorSalesAnalytics);

module.exports = router;
