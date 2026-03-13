const Order = require("../model/orderModel");
const Product = require("../model/productModel");
const asyncWrapper = require("../middleWare/asyncWrapper");

// Get Vendor Sales Analytics
exports.getVendorSalesAnalytics = asyncWrapper(async (req, res, next) => {
  const vendorId = req.user._id;

  // Find all products by this vendor
  const vendorProducts = await Product.find({ user: vendorId });
  const productIds = vendorProducts.map((p) => p._id);

  // Find all delivered orders that contain at least one of these products
  const orders = await Order.find({
    "orderItems.productId": { $in: productIds },
    orderStatus: "Delivered",
  });

  let totalAmount = 0;
  let totalItemsSold = 0;
  const salesPerMonth = new Map();
  const productSales = new Map();

  orders.forEach((order) => {
    let vendorOrderAmount = 0;
    order.orderItems.forEach((item) => {
      if (productIds.some((pId) => pId.equals(item.productId))) {
        vendorOrderAmount += item.price * item.quantity;
        totalItemsSold += item.quantity;

        // Product sales aggregation
        productSales.set(
          item.name,
          (productSales.get(item.name) || 0) + item.price * item.quantity
        );
      }
    });
    totalAmount += vendorOrderAmount;

    // Sales per month aggregation
    const month = order.createdAt.toLocaleString("default", {
      month: "long",
      year: "numeric",
    });
    salesPerMonth.set(
      month,
      (salesPerMonth.get(month) || 0) + vendorOrderAmount
    );
  });

  const monthlySales = Array.from(salesPerMonth, ([name, value]) => ({
    name,
    value,
  }));
  const topProducts = Array.from(productSales, ([name, value]) => ({
    name,
    value,
  }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5); // Top 5 products

  res.status(200).json({
    success: true,
    totalAmount,
    totalOrders: orders.length,
    totalItemsSold,
    monthlySales,
    topProducts,
  });
});
