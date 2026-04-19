const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const Notification = require("../models/notificationModel");
const User = require("../models/userModel");
const Payment = require("../models/paymentModel");
const ErrorHandler = require("../utils/errorHandler");
const asyncWrapper = require("../middleware/asyncWrapper");

// Create new Order
exports.newOrder = asyncWrapper(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  // Enhance order items with vendor info from the database for security and accuracy
  const productIds = orderItems.map((item) => item.productId);
  const products = await Product.find({ _id: { $in: productIds } }).populate("user", "name");

  const finalOrderItems = orderItems.map((item) => {
    if (!item.productId) return item;
    const product = products.find((p) => p._id.toString() === item.productId.toString());
    const itemPrice = item.price * item.quantity;
    const isPaid = paymentInfo.status === "succeeded";
    const commission = isPaid ? itemPrice * 0.1 : 0;
    const netEarning = isPaid ? itemPrice - commission : 0;

    return {
      ...item,
      vendorId: product ? product.user._id : item.vendorId,
      vendorName: product ? product.user.name : item.vendorName || "N/A",
      commission,
      netEarning,
    };
  });

  const order = await Order.create({
    shippingInfo,
    orderItems: finalOrderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  });

  // Create notification for admin
  const admins = await User.find({ role: "admin" });
  for (const admin of admins) {
    await Notification.create({
      recipient: admin._id,
      message: `New order placed: #${order._id}`,
      type: "new_order",
      link: `/admin/order/${order._id}`,
    });
  }

  // Create notifications for vendors
  // Group products by vendor to avoid duplicate notifications per order
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
      link: `/vendor/orders`, // Redirect to vendor orders list
    });
  }

  // Update product status to Sold
  for (const item of orderItems) {
    await updateAvailabilityStatus(item.productId);
  }

  // Save Payment Details
  await Payment.create({
    payment_id: paymentInfo.id,
    order_id: order._id,
    user_id: req.user._id,
    amount: totalPrice,
    payment_method: paymentInfo.status === "succeeded" ? "Stripe" : "Manual",
    transaction_id: paymentInfo.id,
    payment_status: paymentInfo.status === "succeeded" ? "success" : "failed",
  });

  res.status(201).json({
    success: true,
    order,
  });
});

// get Single Order
exports.getSingleOrder = asyncWrapper(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!order) {
    return next(new ErrorHandler("Order not found with this Id", 404));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

// get logged in user  Orders
exports.myOrders = asyncWrapper(async (req, res, next) => {
  const userOrders = await Order.find({ user: req.user._id });

  res.status(200).json({
    success: true,
    userOrders,
  });
});

// get Vendor Orders -- Vendor/Admin
exports.getVendorOrders = asyncWrapper(async (req, res, next) => {
  let orders;
  if (req.user.role === "admin") {
    orders = await Order.find();
  } else {
    // Find all products by this vendor
    const vendorProducts = await Product.find({ user: req.user._id });
    const productIds = vendorProducts.map(p => p._id);

    // Find all orders that contain at least one of these products
    orders = await Order.find({
      "orderItems.productId": { $in: productIds }
    });
  }

  res.status(200).json({
    success: true,
    orders,
  });
});

// get all Orders -- Admin/Vendor
exports.getAllOrders = asyncWrapper(async (req, res, next) => {
  let orders;
  if (req.user.role === "admin") {
    orders = await Order.find();
  } else if (req.user.role === "vendor") {
    // Find all products by this vendor
    const vendorProducts = await Product.find({ user: req.user._id });
    const productIds = vendorProducts.map((p) => p._id);

    // Find all orders that contain at least one of these products
    orders = await Order.find({
      "orderItems.productId": { $in: productIds },
    });
  }

  let totalAmount = 0;

  if (req.user.role === "vendor") {
    // Find all products by this vendor to know which items to sum
    const vendorProducts = await Product.find({ user: req.user._id });
    const vendorProductIds = vendorProducts.map(p => p._id.toString());

    orders.forEach((order) => {
      order.orderItems.forEach(item => {
        if (item.productId && vendorProductIds.includes(item.productId.toString())) {
          totalAmount += item.price * item.quantity;
        }
      });
    });
  } else {
    orders.forEach((order) => {
      totalAmount += order.totalPrice;
    });
  }

  res.status(200).json({
    success: true,
    totalAmount,
    orders,
  });
});

// update Order Status -- Admin
exports.updateOrder = asyncWrapper(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order not found with this Id", 404));
  }

  // Check if vendor is authorized to update this order
  if (req.user.role === "vendor") {
    const productIds = order.orderItems.map(item => item.productId);
    const vendorProducts = await Product.find({
      _id: { $in: productIds },
      user: req.user._id
    });

    if (vendorProducts.length === 0) {
      return next(new ErrorHandler("You are not authorized to update this order", 403));
    }
  }

  if (order.orderStatus === "Delivered") {
    return next(new ErrorHandler("You have already delivered this order", 400));
  }

  const oldStatus = order.orderStatus;
  order.orderStatus = req.body.status;

  if (req.body.status === "Delivered") {
    order.deliveredAt = Date.now();
    
    // Calculate commission on delivery if not already calculated (e.g. for COD)
    order.orderItems.forEach(item => {
      if (!item.commission || item.commission === 0) {
        const itemTotal = item.price * item.quantity;
        item.commission = itemTotal * 0.1;
        item.netEarning = itemTotal - item.commission;
      }
    });
  }

  // Restore stock if order is cancelled by Admin/Vendor
  if (req.body.status === "Cancelled" && oldStatus !== "Cancelled") {
    for (const item of order.orderItems) {
      await restoreAvailabilityStatus(item.productId);
    }
  }

  await order.save({ validateBeforeSave: false });

  // Create notification for user/admin on status update
  if (oldStatus !== req.body.status) {
    // Notify Admin
    const admins = await User.find({ role: "admin" });
    for (const admin of admins) {
      await Notification.create({
        recipient: admin._id,
        message: `Order #${order._id} status updated to: ${req.body.status}`,
        type: "payment_update",
        link: `/admin/order/${order._id}`,
      });
    }

    // Notify Customer
    await Notification.create({
      recipient: order.user,
      message: `Your order #${order._id} status has been updated to: ${req.body.status}`,
      type: "payment_update",
      link: `/orders`,
    });
  }

  res.status(200).json({
    success: true,
  });
});

// Cancel Order -- Customer
exports.cancelOrder = asyncWrapper(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order not found with this Id", 404));
  }

  // Check if the order belongs to the logged-in user
  if (order.user.toString() !== req.user._id.toString()) {
    return next(new ErrorHandler("You are not authorized to cancel this order", 403));
  }

  // Check if the order status is either "Pending" or "Processing"
  if (order.orderStatus !== "Pending" && order.orderStatus !== "Processing") {
    return next(
      new ErrorHandler(
        `Cannot cancel order once it is ${order.orderStatus}`,
        400
      )
    );
  }

  // Update order status to "Cancelled"
  order.orderStatus = "Cancelled";
  await order.save({ validateBeforeSave: false });

  // Restore product stock (AvailabilityStatus = "Available")
  for (const item of order.orderItems) {
    await restoreAvailabilityStatus(item.productId);
  }

  // Notify Admin
  const admins = await User.find({ role: "admin" });
  for (const admin of admins) {
    await Notification.create({
      recipient: admin._id,
      message: `Order #${order._id} has been cancelled by the customer.`,
      type: "order_cancelled",
      link: `/admin/order/${order._id}`,
    });
  }

  // Notify Vendors
  const productIds = order.orderItems.map((item) => item.productId);
  const products = await Product.find({ _id: { $in: productIds } });
  
  const vendorIds = [...new Set(products.map((p) => p.user.toString()))];
  for (const vendorId of vendorIds) {
    await Notification.create({
      recipient: vendorId,
      message: `An order containing your product has been cancelled: #${order._id}`,
      type: "order_cancelled",
      link: `/vendor/orders`,
    });
  }

  res.status(200).json({
    success: true,
    message: "Order Cancelled Successfully",
  });
});

async function restoreAvailabilityStatus(id) {
  const product = await Product.findById(id);

  if (product) {
    product.availabilityStatus = "Available";
    await product.save({ validateBeforeSave: false });
  }
}

async function updateAvailabilityStatus(id) {
  const product = await Product.findById(id);

  if (product) {
    product.availabilityStatus = "Sold";
    await product.save({ validateBeforeSave: false });
  }
}

// delete Order -- Admin/Vendor
exports.deleteOrder = asyncWrapper(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order not found with this Id", 404));
  }

  // Check if vendor is authorized to delete this order
  if (req.user.role === "vendor") {
    const productIds = order.orderItems.map(item => item.productId);
    const vendorProducts = await Product.find({
      _id: { $in: productIds },
      user: req.user._id
    });

    if (vendorProducts.length === 0) {
      return next(new ErrorHandler("You are not authorized to delete this order", 403));
    }
  }

  await order.deleteOne();

  res.status(200).json({
    success: true,
  });
});
