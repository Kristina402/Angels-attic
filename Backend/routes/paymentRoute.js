const express = require("express");
const { processEsewaPayment, esewaSuccess, esewaFailure } = require("../controller/paymentController");
const { isAuthentictedUser } = require("../middleware/auth");
const router = express.Router();

router.route("/payment/esewa/process").post(processEsewaPayment);
router.route("/payment/esewa/success").get(esewaSuccess);
router.route("/payment/esewa/failure").get(esewaFailure);

module.exports = router;
