const CryptoJS = require("crypto-js");
const axios = require("axios");
const asyncWrapper = require("../middleware/asyncWrapper");
const Order = require("../models/orderModel");
const Payment = require("../models/paymentModel");
const Product = require("../models/productModel");

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
          
          // Save payment details to database
          await Payment.create({
            payment_id: decodedData.transaction_code,
            order_id: order._id,
            user_id: order.user,
            amount: order.totalPrice,
            payment_method: "eSewa",
            transaction_id: decodedData.transaction_code,
            payment_status: "success",
          });

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

// Get all payments -- Admin
exports.getAllPayments = asyncWrapper(async (req, res, next) => {
  const payments = await Payment.find().sort({ createdAt: -1 });

  let totalRevenue = 0;
  payments.forEach(payment => {
    if (payment.payment_status === "success") {
      totalRevenue += payment.amount;
    }
  });

  res.status(200).json({
    success: true,
    payments,
    totalRevenue,
  });
});

// Get vendor-specific payments -- Vendor
exports.getVendorPayments = asyncWrapper(async (req, res, next) => {
  // Find all products by this vendor
  const vendorProducts = await Product.find({ user: req.user._id });
  const productIds = vendorProducts.map(p => p._id);

  // Find all orders that contain at least one of these products
  const orders = await Order.find({
    "orderItems.productId": { $in: productIds }
  });
  const orderIds = orders.map(o => o._id);

  // Find payments related to these orders
  const payments = await Payment.find({
    order_id: { $in: orderIds }
  }).sort({ createdAt: -1 });

  let vendorRevenue = 0;
  const vendorProductIds = vendorProducts.map(p => p._id.toString());

  payments.forEach(payment => {
    if (payment.payment_status === "success") {
      // Find the corresponding order to calculate only this vendor's share
      const order = orders.find(o => o._id.toString() === payment.order_id.toString());
      if (order) {
        order.orderItems.forEach(item => {
          if (item.productId && vendorProductIds.includes(item.productId.toString())) {
            vendorRevenue += item.price * item.quantity;
          }
        });
      }
    }
  });

  res.status(200).json({
    success: true,
    payments,
    vendorRevenue,
  });
});


