const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const asyncWrapper = require("../middleware/asyncWrapper");

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

// Get Admin Sales Analytics
exports.getAdminSalesAnalytics = asyncWrapper(async (req, res, next) => {
  // Find all delivered orders
  const orders = await Order.find({ orderStatus: "Delivered" });

  let totalAmount = 0;
  let totalItemsSold = 0;
  const salesPerMonth = new Map();
  const productSales = new Map();

  orders.forEach((order) => {
    totalAmount += order.totalPrice;
    
    order.orderItems.forEach((item) => {
      totalItemsSold += item.quantity;

      // Product sales aggregation
      productSales.set(
        item.name,
        (productSales.get(item.name) || 0) + item.price * item.quantity
      );
    });

    // Sales per month aggregation
    const month = order.createdAt.toLocaleString("default", {
      month: "long",
      year: "numeric",
    });
    salesPerMonth.set(
      month,
      (salesPerMonth.get(month) || 0) + order.totalPrice
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

  // Get recent transactions (delivered orders)
  const recentTransactions = await Order.find({ orderStatus: "Delivered" })
    .sort({ createdAt: -1 })
    .limit(10)
    .populate("user", "name email");

  res.status(200).json({
    success: true,
    totalAmount,
    totalOrders: orders.length,
    totalItemsSold,
    monthlySales,
    topProducts,
    recentTransactions,
  });
});

// Get Admin Reports
exports.getAdminReports = asyncWrapper(async (req, res, next) => {
  const { startDate, endDate } = req.query;
  
  let dateFilter = { orderStatus: "Delivered" };
  if (startDate && endDate) {
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    
    dateFilter.createdAt = {
      $gte: new Date(startDate),
      $lte: end,
    };
  }

  const orders = await Order.find(dateFilter);

  // Group by type (Sales, Orders, Vendors, Products)
  const reportData = [
    {
      id: 1,
      type: "Total Sales Report",
      dateRange: startDate && endDate ? `${startDate} to ${endDate}` : "All Time",
      totalOrders: orders.length,
      totalRevenue: orders.reduce((acc, curr) => acc + curr.totalPrice, 0),
      status: "Completed",
    },
    {
      id: 2,
      type: "Order Report",
      dateRange: startDate && endDate ? `${startDate} to ${endDate}` : "All Time",
      totalOrders: orders.length,
      totalRevenue: orders.reduce((acc, curr) => acc + curr.totalPrice, 0),
      status: "Completed",
    },
    {
      id: 3,
      type: "Vendor Performance",
      dateRange: startDate && endDate ? `${startDate} to ${endDate}` : "All Time",
      totalOrders: orders.length, // Simplified
      totalRevenue: orders.reduce((acc, curr) => acc + curr.totalPrice, 0),
      status: "Active",
    },
    {
      id: 4,
      type: "Product Sales Report",
      dateRange: startDate && endDate ? `${startDate} to ${endDate}` : "All Time",
      totalOrders: orders.reduce((acc, curr) => acc + curr.orderItems.length, 0),
      totalRevenue: orders.reduce((acc, curr) => acc + curr.totalPrice, 0),
      status: "Completed",
    },
  ];

  res.status(200).json({
    success: true,
    reports: reportData,
  });
});
