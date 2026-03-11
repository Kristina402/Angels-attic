const mongoose = require("mongoose");
const Product = require("./model/productModel");
const User = require("./model/userModel");
const dotenv = require("dotenv");
const connectDB = require("./db/connectDB");

dotenv.config({ path: "Backend/config/config.env" });

const products = [
  // Skirts
  {
    name: "Floral Summer Skirt",
    description: "A beautiful floral skirt perfect for summer outings. Lightweight and breathable fabric.",
    price: 1200,
    category: "Skirts",
    size: "M",
    Stock: 10,
    images: [
      {
        public_id: "skirts/skrit1",
        url: "/products/skirts/skrit1.png",
      },
    ],
  },
  {
    name: "Denim Mini Skirt",
    description: "Classic denim mini skirt with a vintage wash. A versatile piece for any wardrobe.",
    price: 1500,
    category: "Skirts",
    size: "S",
    Stock: 5,
    images: [
      {
        public_id: "skirts/skirt2",
        url: "/products/skirts/skirt2.png",
      },
    ],
  },
  {
    name: "Pleated Midi Skirt",
    description: "Elegant pleated midi skirt in a soft pastel shade. Perfect for office or casual wear.",
    price: 1800,
    category: "Skirts",
    size: "L",
    Stock: 8,
    images: [
      {
        public_id: "skirts/skirt3",
        url: "/products/skirts/skirt3.png",
      },
    ],
  },
  // Tops
  {
    name: "White Lace Top",
    description: "Delicate white lace top with intricate patterns. Ideal for a feminine and chic look.",
    price: 900,
    category: "Women’s Wear",
    size: "S",
    Stock: 12,
    images: [
      {
        public_id: "tops/tops1",
        url: "/products/tops/tops/tops1.png",
      },
    ],
  },
  {
    name: "Striped Casual Tee",
    description: "Comfortable striped cotton tee for everyday wear. Soft and durable.",
    price: 700,
    category: "Women’s Wear",
    size: "M",
    Stock: 20,
    images: [
      {
        public_id: "tops/tops2",
        url: "/products/tops/tops/tops2.png",
      },
    ],
  },
  {
    name: "Black Silk Blouse",
    description: "Luxurious black silk blouse for a sophisticated evening look.",
    price: 2500,
    category: "Women’s Wear",
    size: "L",
    Stock: 4,
    images: [
      {
        public_id: "tops/tops3",
        url: "/products/tops/tops/tops3.png",
      },
    ],
  },
  // Jackets
  {
    name: "Vintage Leather Jacket",
    description: "Classic black leather jacket with a distressed vintage finish. Timeless style.",
    price: 4500,
    category: "Outerwear",
    size: "L",
    Stock: 3,
    images: [
      {
        public_id: "jackets/jacket1",
        url: "/products/jackets/jacket1.png",
      },
    ],
  },
  {
    name: "Denim Trucker Jacket",
    description: "Essential denim jacket with a comfortable fit and classic button-up front.",
    price: 3200,
    category: "Outerwear",
    size: "M",
    Stock: 7,
    images: [
      {
        public_id: "jackets/jacket2",
        url: "/products/jackets/jacket2.png",
      },
    ],
  },
  {
    name: "Puffer Winter Coat",
    description: "Warm and cozy puffer coat for cold winter days. Water-resistant outer shell.",
    price: 5500,
    category: "Outerwear",
    size: "XL",
    Stock: 5,
    images: [
      {
        public_id: "jackets/jacket3",
        url: "/products/jackets/jacket3.png",
      },
    ],
  },
  // Bags
  {
    name: "Leather Tote Bag",
    description: "Spacious leather tote bag for work or travel. High-quality craftsmanship.",
    price: 3500,
    category: "Bags",
    size: "One Size",
    Stock: 10,
    images: [
      {
        public_id: "bags/bags1",
        url: "/products/bags/bags1.png",
      },
    ],
  },
  {
    name: "Canvas Backpack",
    description: "Durable canvas backpack for students or commuters. Multiple compartments.",
    price: 1500,
    category: "Bags",
    size: "One Size",
    Stock: 15,
    images: [
      {
        public_id: "bags/bag2",
        url: "/products/bags/bag2.png",
      },
    ],
  },
  {
    name: "Crossbody Purse",
    description: "Stylish crossbody purse for carrying essentials. Compact and lightweight.",
    price: 1200,
    category: "Bags",
    size: "One Size",
    Stock: 8,
    images: [
      {
        public_id: "bags/bag3",
        url: "/products/bags/bag3.png",
      },
    ],
  },
  // Footwear
  {
    name: "Classic White Sneakers",
    description: "Versatile white sneakers that go with any outfit. Comfortable for all-day wear.",
    price: 2800,
    category: "Footwear",
    size: "8",
    Stock: 12,
    images: [
      {
        public_id: "footwares/footware1",
        url: "/products/footwares/footware1.png",
      },
    ],
  },
  {
    name: "Leather Ankle Boots",
    description: "Elegant leather ankle boots with a manageable heel. Perfect for autumn.",
    price: 4200,
    category: "Footwear",
    size: "7",
    Stock: 6,
    images: [
      {
        public_id: "footwares/footware2",
        url: "/products/footwares/footware2.png",
      },
    ],
  },
  {
    name: "Casual Slip-ons",
    description: "Easy-to-wear slip-on shoes for a relaxed and casual look.",
    price: 1500,
    category: "Footwear",
    size: "9",
    Stock: 10,
    images: [
      {
        public_id: "footwares/footware3",
        url: "/products/footwares/footware3.png",
      },
    ],
  },
];

const seedProducts = async () => {
  try {
    await connectDB();

    // Create a default admin user if none exists
    let adminUser = await User.findOne({ role: "admin" });
    if (!adminUser) {
      console.log("No admin user found. Creating a default admin...");
      adminUser = await User.create({
        name: "Admin User",
        email: "admin@angelsattic.com",
        password: "adminpassword123",
        role: "admin",
        avatar: {
          public_id: "default_avatar",
          url: "https://res.cloudinary.com/dtzzoaiyt/image/upload/v1/Avatar/default_avatar",
        },
      });
      console.log("Default admin user created.");
    }

    await Product.deleteMany();
    console.log("Products are deleted");

    const productsWithUser = products.map((product) => ({
      ...product,
      user: adminUser._id,
    }));

    await Product.insertMany(productsWithUser);
    console.log("All Products are added.");

    process.exit();
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

seedProducts();
