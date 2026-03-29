const CryptoJS = require("crypto-js");
const axios = require("axios");
const asyncWrapper = require("../middleware/asyncWrapper");
const Order = require("../models/orderModel");

// Generate eSewa Signature
exports.processEsewaPayment = asyncWrapper(async (req, res, next) => {
  const { total_amount, transaction_uuid } = req.body;

  const product_code = process.env.ESEWA_PRODUCT_CODE || "EPAYTEST";
  const secret_key = process.env.ESEWA_SECRET_KEY || "8gBm/:&EnhH.1/q(";

  // Format values precisely to ensure backend and frontend match
  const t_amount = String(total_amount).trim();
  const t_uuid = String(transaction_uuid).trim();
  const p_code = String(product_code).trim();

  // eSewa v2 signature message: total_amount=VAL,transaction_uuid=VAL,product_code=VAL
  const message = `total_amount=${t_amount},transaction_uuid=${t_uuid},product_code=${p_code}`;
  
  // Use CryptoJS as recommended in eSewa documentation
  const hash = CryptoJS.HmacSHA256(message, secret_key.trim());
  const signature = CryptoJS.enc.Base64.stringify(hash);

  console.log("------------------- eSewa Debug -------------------");
  console.log("Message signed:", message);
  console.log("Signature generated:", signature);
  console.log("--------------------------------------------------");

  res.status(200).json({
    success: true,
    signature,
    product_code: p_code,
    success_url: process.env.ESEWA_SUCCESS_URL,
    failure_url: process.env.ESEWA_FAILURE_URL,
  });
});

// Handle eSewa Success Callback
exports.esewaSuccess = asyncWrapper(async (req, res, next) => {
  const { data } = req.query; // eSewa returns data in query param 'data' (base64 encoded)
  
  if (!data) {
    return res.redirect(`${process.env.FRONTEND_URL}/#/cart?payment=failed`);
  }

  // Decode the data
  const decodedData = JSON.parse(Buffer.from(data, 'base64').toString('utf-8'));
  
  // Decoded data structure:
  // {
  //   "status": "COMPLETE",
  //   "signature": "...",
  //   "transaction_code": "...",
  //   "total_amount": "110.0",
  //   "transaction_uuid": "...",
  //   "product_code": "...",
  //   "success_url": "...",
  //   "signed_field_names": "..."
  // }

  if (decodedData.status === "COMPLETE") {
    try {
      // Perform transaction verification via status API
      // Since it's UAT/Test context, we use rc-epay.esewa.com.np. For production, use epay.esewa.com.np
      const verificationUrl = `https://rc-epay.esewa.com.np/api/epay/transaction/status/?product_code=${decodedData.product_code}&total_amount=${decodedData.total_amount}&transaction_uuid=${decodedData.transaction_uuid}`;
      
      const response = await axios.get(verificationUrl);
      
      if (response.data.status === "COMPLETE") {
        const order = await Order.findById(decodedData.transaction_uuid);
        
        if (order) {
          order.paymentInfo = {
            id: decodedData.transaction_code,
            status: "succeeded",
            type: "eSewa"
          };
          order.paidAt = Date.now();
          order.orderStatus = "Processing"; // Update to processing upon payment
          await order.save();
          
          // Redirect to frontend success page
          return res.redirect(`${process.env.FRONTEND_URL}/#/success?id=${order._id}&total=${order.totalPrice}&status=${order.orderStatus}`);
        }
      }
    } catch (error) {
      console.error("eSewa Verification Error:", error.message);
      // Fallback or handle error
    }
  }

  res.redirect(`${process.env.FRONTEND_URL}/#/cart?payment=failed`);
});

// Handle eSewa Failure Callback
exports.esewaFailure = asyncWrapper(async (req, res, next) => {
  res.redirect(`${process.env.FRONTEND_URL}/#/cart?payment=failed`);
});

