const CryptoJS = require("crypto-js");
const axios = require("axios");
const asyncWrapper = require("../middleware/asyncWrapper");
const Order = require("../models/orderModel");
const Payment = require("../models/paymentModel");
const Product = require("../models/productModel");
const User = require("../models/userModel");
const Notification = require("../models/notificationModel");
const ErrorHandler = require("../utils/errorHandler");

// Generate eSewa Signature
exports.processEsewaPayment = asyncWrapper(async (req, res, next) => {
  const { total_amount, transaction_uuid } = req.body;

  const product_code = process.env.ESEWA_PRODUCT_CODE || "EPAYTEST";
  const secret_key = process.env.ESEWA_SECRET_KEY || "8gBm/:&EnhH.1/q(";

  // eSewa v2 signature is extremely sensitive to formatting.
  // We force the amount to a string representation with exactly one decimal place
  const t_amount = Number(total_amount).toFixed(1);
  const t_uuid = String(transaction_uuid).trim();
  const p_code = String(product_code).trim();

  // eSewa v2 signature message format: total_amount=VAL,transaction_uuid=VAL,product_code=VAL
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
    total_amount: t_amount, // Return the exact string signed
    transaction_uuid: t_uuid,
    gateway_url: process.env.ESEWA_GATEWAY_URL,
    status_check_url: process.env.ESEWA_STATUS_CHECK_URL,
    success_url: process.env.ESEWA_SUCCESS_URL,
    failure_url: process.env.ESEWA_FAILURE_URL,
  });
});

// Initiate eSewa Payment - Stores order data and returns a UUID
exports.initiateEsewaPayment = asyncWrapper(async (req, res, next) => {
  const { orderData } = req.body;

  if (!orderData) {
    return next(new ErrorHandler("Order data is required", 400));
  }

  // Create a payment record to store order data temporarily
  const payment = await Payment.create({
    payment_id: `PENDING_${Date.now()}`,
    user_id: req.user._id,
    amount: orderData.totalPrice,
    payment_method: "eSewa",
    payment_status: "failed", // Initially failed until success callback
    order_data: orderData,
  });

  res.status(200).json({
    success: true,
    transaction_uuid: payment._id,
    total_amount: orderData.totalPrice,
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
  
  if (decodedData.status === "COMPLETE") {
    try {
      // eSewa may return comma-separated amounts (e.g. 1,200.0). We must strip commas for the status check API.
      const rawAmount = String(decodedData.total_amount).replace(/,/g, '');
      const verificationUrl = `${process.env.ESEWA_STATUS_CHECK_URL}?product_code=${decodedData.product_code}&total_amount=${rawAmount}&transaction_uuid=${decodedData.transaction_uuid}`;
      
      const response = await axios.get(verificationUrl);
      
      if (response.data.status === "COMPLETE") {
        // eSewa transaction_uuid is now our Payment record ID
        const paymentRecord = await Payment.findById(decodedData.transaction_uuid);
        
        if (!paymentRecord) {
          console.error("Payment record not found");
          return res.redirect(`${process.env.FRONTEND_URL}/#/cart?payment=failed`);
        }

        // Check if order already created for this payment to prevent duplicates
        if (paymentRecord.order_id) {
           return res.redirect(`${process.env.FRONTEND_URL}/#/success?id=${paymentRecord.order_id}&total=${paymentRecord.amount}&status=Processing`);
        }

        const orderData = paymentRecord.order_data;
        if (!orderData) {
          console.error("Order data missing in payment record");
          return res.redirect(`${process.env.FRONTEND_URL}/#/cart?payment=failed`);
        }

        // Create the actual Order now
        const order = await Order.create({
          ...orderData,
          paymentInfo: {
            id: decodedData.transaction_code,
            status: "succeeded",
            method: "eSewa"
          },
          paidAt: Date.now(),
          orderStatus: "Processing",
          user: paymentRecord.user_id,
        });

        // RE-IMPLEMENT MISSING LOGIC FROM newOrder
        // Update product status to Sold and notify vendors
        const productIds = order.orderItems.map((item) => item.productId);
        const products = await Product.find({ _id: { $in: productIds } }).populate("user", "name");

        for (const item of order.orderItems) {
           const product = await Product.findById(item.productId);
           if (product) {
              product.availabilityStatus = "Sold";
              await product.save({ validateBeforeSave: false });
           }
        }

        // Create notifications for vendors
        const vendorMap = new Map();
        products.forEach(p => {
          if (!vendorMap.has(p.user._id.toString())) {
            vendorMap.set(p.user._id.toString(), []);
          }
          vendorMap.get(p.user._id.toString()).push(p.name);
        });

        for (const [vendorId, productNames] of vendorMap) {
          await Notification.create({
            recipient: vendorId,
            message: `You received a new order for: ${productNames.join(", ")}`,
            type: "new_order",
            link: `/vendor/orders`,
          });
        }
        // END RE-IMPLEMENTED LOGIC

        // Update payment record
        paymentRecord.payment_id = decodedData.transaction_code;
        paymentRecord.transaction_id = decodedData.transaction_code;
        paymentRecord.payment_status = "success";
        paymentRecord.order_id = order._id;
        await paymentRecord.save();

        // Notify Admin
        const admins = await User.find({ role: "admin" });
        for (const admin of admins) {
          await Notification.create({
            recipient: admin._id,
            message: `New order placed via eSewa: #${order._id}`,
            type: "new_order",
            link: `/admin/order/${order._id}`,
          });
        }

        // Redirect to frontend success page
        return res.redirect(`${process.env.FRONTEND_URL}/#/success?id=${order._id}&total=${order.totalPrice}&status=${order.orderStatus}`);
      } else {
        console.error("eSewa Verification did not return COMPLETE:", response.data);
      }
    } catch (error) {
      console.error("eSewa Verification API Axios Failure:", error.message);
    }
  } else {
    console.error("Decoded eSewa status was not COMPLETE:", decodedData);
  }

  // Fallback if verification fails or order isn't found
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
// Get vendor-specific payments -- Vendor/Admin
exports.getVendorPayments = asyncWrapper(async (req, res, next) => {
  let vendorProducts;
  let orders;
  let payments;
  let vendorRevenue = 0;
  let totalCommission = 0;
  let totalNetEarning = 0;

  if (req.user.role === "admin") {
    // Admins see all payments
    payments = await Payment.find().sort({ createdAt: -1 });
    orders = await Order.find(); // Needed for revenue calculation below
    
    payments.forEach(payment => {
      if (payment.payment_status === "success") {
        const order = orders.find(o => o._id.toString() === payment.order_id.toString());
        if (order) {
          order.orderItems.forEach(item => {
            const itemTotal = item.price * item.quantity;
            const calcCommission = itemTotal * 0.10;
            vendorRevenue += itemTotal;
            totalCommission += calcCommission;
            totalNetEarning += itemTotal - calcCommission;
          });
        }
      }
    });
  } else {
    // Find all products by this vendor
    vendorProducts = await Product.find({ user: req.user._id });
    const productIds = vendorProducts.map(p => p._id);

    // Find all orders that contain at least one of these products
    orders = await Order.find({
      "orderItems.productId": { $in: productIds }
    });
    const orderIds = orders.map(o => o._id);

    // Find payments related to these orders
    payments = await Payment.find({
      order_id: { $in: orderIds }
    }).sort({ createdAt: -1 });

    const vendorProductIds = vendorProducts.map(p => p._id.toString());

    payments.forEach(payment => {
      if (payment.payment_status === "success") {
        // Find the corresponding order to calculate only this vendor's share
        const order = orders.find(o => o._id.toString() === payment.order_id.toString());
        if (order) {
          order.orderItems.forEach(item => {
            if (item.productId && vendorProductIds.includes(item.productId.toString())) {
              const itemTotal = item.price * item.quantity;
              const calcCommission = itemTotal * 0.10;
              vendorRevenue += itemTotal;
              totalCommission += calcCommission;
              totalNetEarning += itemTotal - calcCommission;
            }
          });
        }
      }
    });
  }

  res.status(200).json({
    success: true,
    payments,
    vendorRevenue,
    totalCommission,
    totalNetEarning,
  });
});

// Get all vendor commissions -- Admin
exports.getAdminVendorCommissions = asyncWrapper(async (req, res, next) => {
    const orders = await Order.find();
    
    const vendorStats = {};

    orders.forEach(order => {
        // Only count processing, delivered, or succeeded orders (paid ones)
        if (order.paymentInfo && (order.paymentInfo.status === "succeeded" || order.orderStatus !== "Pending")) {
            order.orderItems.forEach(item => {
                if (!item.vendorId) return; // Skip if no vendorId (legacy orders)
                const vendorId = item.vendorId.toString();
                if (!vendorStats[vendorId]) {
                    vendorStats[vendorId] = {
                        vendorId,
                        vendorName: item.vendorName,
                        totalCommission: 0,
                        totalEarnings: 0,
                        totalSales: 0
                    };
                }
                const itemTotal = item.price * item.quantity;
                const calcCommission = itemTotal * 0.10;
                vendorStats[vendorId].totalSales += itemTotal;
                vendorStats[vendorId].totalCommission += calcCommission;
                vendorStats[vendorId].totalEarnings += itemTotal - calcCommission;
            });
        }
    });

    const vendorCommissionList = Object.values(vendorStats);

    res.status(200).json({
        success: true,
        vendorCommissionList
    });
});


