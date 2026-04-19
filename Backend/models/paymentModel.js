const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  payment_id: {
    type: String,
    required: true,
  },
  order_id: {
    type: mongoose.Schema.ObjectId,
    ref: "Order",
    required: false, // Optional until order is created after payment success
  },
  user_id: {
    type: mongoose.Schema.ObjectId,
    ref: "userModel",
    required: true,
  },
  order_data: {
    type: Object, // Store order details temporarily
    required: false,
  },
  amount: {
    type: Number,
    required: true,
  },
  payment_method: {
    type: String,
    required: true,
  },
  transaction_id: {
    type: String,
    required: false, // For eSewa, it might be transaction code
  },
  payment_status: {
    type: String,
    required: true,
    enum: ["success", "failed"],
    default: "success",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Payment", paymentSchema);
