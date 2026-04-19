const express = require("express");
const { 
  processEsewaPayment, 
  initiateEsewaPayment,
  esewaSuccess, 
  esewaFailure,
  getAllPayments,
  getVendorPayments,
  getAdminVendorCommissions
} = require("../controller/paymentController");
const { isAuthentictedUser, authorizeRoles } = require("../middleware/auth");
const router = express.Router();

router.route("/payment/esewa/process").post(processEsewaPayment);
router.route("/payment/esewa/initiate").post(isAuthentictedUser, initiateEsewaPayment);
router.route("/payment/esewa/success").get(esewaSuccess);
router.route("/payment/esewa/failure").get(esewaFailure);

// Admin Routes
router.route("/admin/payments").get(isAuthentictedUser, authorizeRoles("admin"), getAllPayments);
router.route("/admin/commissions").get(isAuthentictedUser, authorizeRoles("admin"), getAdminVendorCommissions);

// Vendor Routes
router.route("/vendor/payments").get(isAuthentictedUser, authorizeRoles("admin", "vendor"), getVendorPayments);

module.exports = router;

