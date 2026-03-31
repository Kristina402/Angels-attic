const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Product Name"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Please Enter Product Description"],
    minLength: [10, "Description must be at least 10 characters"],
  },
  info: {
    type: String,
  },
  price: {
    type: Number,
    required: [true, "Please Enter Product Price"],
    min: [1, "Price must be greater than 0"],
    maxLength: [8, "Price cannot exceed 8 characters"],
  },
  discount: {
    type: Number,
    default: 0,
  },
  ratings: {
    type: Number,
    default: 0,
  },
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  category: {
    type: String,
    required: [true, "Please Enter Product Category"],
  },
  size: {
    type: String,
    required: [true, "Please Enter Product Size"],
  },
  condition: {
    type: String,
    enum: ["New", "Like New", "Pre-loved"],
    default: "Pre-loved",
  },
  availabilityStatus: {
    type: String,
    enum: ["Available", "Sold"],
    default: "Available",
  },
  numOfReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "userModel",
        required: true,
      },
      order: {
        type: mongoose.Schema.ObjectId,
        ref: "Order",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
      vendor: {
        type: mongoose.Schema.ObjectId,
        ref: "userModel",
        required: true,
      },
    },
  ],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "userModel",
    required: true,
  },
  isApproved: {
    type: Boolean,
    default: true, // Default to true for existing products
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Product", productSchema);
