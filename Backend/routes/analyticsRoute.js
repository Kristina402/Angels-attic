const express = require("express");
const { getVendorSalesAnalytics, getAdminSalesAnalytics, getAdminReports } = require("../controller/analyticsController");
const { isAuthentictedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router
  .route("/vendor/analytics")
  .get(isAuthentictedUser, authorizeRoles("vendor"), getVendorSalesAnalytics);

router
  .route("/admin/analytics")
  .get(isAuthentictedUser, authorizeRoles("admin"), getAdminSalesAnalytics);

router
  .route("/admin/reports")
  .get(isAuthentictedUser, authorizeRoles("admin"), getAdminReports);

module.exports = router;
