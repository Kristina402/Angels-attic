const express = require("express");
const { 
  processEsewaPayment, 
  esewaSuccess, 
  esewaFailure,
  getAllPayments,
  getVendorPayments
} = require("../controller/paymentController");
const { isAuthentictedUser, authorizeRoles } = require("../middleware/auth");
const router = express.Router();

router.route("/payment/esewa/process").post(processEsewaPayment);
router.route("/payment/esewa/success").get(esewaSuccess);
router.route("/payment/esewa/failure").get(esewaFailure);

// Admin Routes
router.route("/admin/payments").get(isAuthentictedUser, authorizeRoles("admin"), getAllPayments);

// Vendor Routes
router.route("/vendor/payments").get(isAuthentictedUser, authorizeRoles("vendor"), getVendorPayments);

module.exports = router;

