const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const Notification = require("../models/notificationModel");
const User = require("../models/userModel");
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

  const order = await Order.create({
    shippingInfo,
    orderItems,
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
  const productIds = orderItems.map(item => item.productId);
  const products = await Product.find({ _id: { $in: productIds } });
  
  // Group products by vendor to avoid duplicate notifications per order
  const vendorMap = new Map();
  products.forEach(p => {
    if (!vendorMap.has(p.user.toString())) {
      vendorMap.set(p.user.toString(), []);
    }
    vendorMap.get(p.user.toString()).push(p.name);
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

// get Vendor Orders
exports.getVendorOrders = asyncWrapper(async (req, res, next) => {
  // Find all products by this vendor
  const vendorProducts = await Product.find({ user: req.user._id });
  const productIds = vendorProducts.map(p => p._id);

  // Find all orders that contain at least one of these products
  const orders = await Order.find({
    "orderItems.productId": { $in: productIds }
  });

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

  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });

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

  await order.remove();

  res.status(200).json({
    success: true,
  });
});
