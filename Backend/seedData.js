const mongoose = require("mongoose");
const Product = require("./models/productModel");
const User = require("./models/userModel");
const dotenv = require("dotenv");
const connectDB = require("./db/connectDB");

dotenv.config({ path: "Backend/config/config.env" });

const products = [
  // Bags
  {
    name: "Classic Leather Tote",
    description: "Spacious and durable leather tote bag for everyday use.",
    price: 2500,
    category: "bags",
    size: "One Size",
    Stock: 15,
    images: [{ public_id: "bags1", url: "/products/bags/bags1.png" }],
  },
  {
    name: "Urban Backpack",
    description: "Modern canvas backpack with multiple compartments for tech and travel.",
    price: 1800,
    category: "bags",
    size: "One Size",
    Stock: 10,
    images: [{ public_id: "bag2", url: "/products/bags/bag2.png" }],
  },
  {
    name: "Evening Clutch",
    description: "Elegant clutch bag perfect for parties and formal events.",
    price: 1200,
    category: "bags",
    size: "One Size",
    Stock: 8,
    images: [{ public_id: "bag3", url: "/products/bags/bag3.png" }],
  },
  // Bottoms
  {
    name: "High-Waist Jeans",
    description: "Classic blue high-waist denim jeans with a comfortable fit.",
    price: 2200,
    category: "bottoms",
    size: "M",
    Stock: 20,
    images: [{ public_id: "bottoms1", url: "/products/bottoms/bottoms1.png" }],
  },
  {
    name: "Casual Chinos",
    description: "Breathable cotton chinos available in various earthy tones.",
    price: 1600,
    category: "bottoms",
    size: "L",
    Stock: 12,
    images: [{ public_id: "bottom2", url: "/products/bottoms/bottom2.png" }],
  },
  {
    name: "Active Leggings",
    description: "Stretchable and sweat-wicking leggings for workout and yoga.",
    price: 1400,
    category: "bottoms",
    size: "S",
    Stock: 25,
    images: [{ public_id: "bottom3", url: "/products/bottoms/bottom3.png" }],
  },
  // Footwares
  {
    name: "White Street Sneakers",
    description: "Minimalist white sneakers that go with any outfit.",
    price: 3200,
    category: "footwares",
    size: "8",
    Stock: 10,
    images: [{ public_id: "footware1", url: "/products/footwares/footware1.png" }],
  },
  {
    name: "Classic Chelsea Boots",
    description: "Timeless suede Chelsea boots with an easy slip-on design.",
    price: 4500,
    category: "footwares",
    size: "9",
    Stock: 5,
    images: [{ public_id: "footware2", url: "/products/footwares/footware2.png" }],
  },
  {
    name: "Running Performance Shoes",
    description: "Lightweight running shoes with superior cushioning and grip.",
    price: 3800,
    category: "footwares",
    size: "10",
    Stock: 15,
    images: [{ public_id: "footware3", url: "/products/footwares/footware3.png" }],
  },
  // Jackets
  {
    name: "Vintage Denim Jacket",
    description: "Classic oversized denim jacket with a vintage wash finish.",
    price: 2800,
    category: "jackets",
    size: "L",
    Stock: 10,
    images: [{ public_id: "jacket1", url: "/products/jackets/jacket1.png" }],
  },
  {
    name: "Leather Biker Jacket",
    description: "Premium faux leather jacket with metallic zipper details.",
    price: 5500,
    category: "jackets",
    size: "M",
    Stock: 4,
    images: [{ public_id: "jacket2", url: "/products/jackets/jacket2.png" }],
  },
  {
    name: "Puffer Winter Coat",
    description: "Warm and stylish puffer jacket for extreme cold weather.",
    price: 4800,
    category: "jackets",
    size: "XL",
    Stock: 7,
    images: [{ public_id: "jacket3", url: "/products/jackets/jacket3.png" }],
  },
  // Skirts
  {
    name: "Floral Summer Skirt",
    description: "Lightweight floral print skirt perfect for sunny days.",
    price: 900,
    category: "skirts",
    size: "S",
    Stock: 15,
    images: [{ public_id: "skrit1", url: "/products/skirts/skrit1.png" }],
  },
  {
    name: "Pleated Midi Skirt",
    description: "Elegant pleated midi skirt suitable for office or casual wear.",
    price: 1500,
    category: "skirts",
    size: "M",
    Stock: 10,
    images: [{ public_id: "skirt2", url: "/products/skirts/skirt2.png" }],
  },
  {
    name: "Denim Mini Skirt",
    description: "Trendy denim mini skirt with frayed hem details.",
    price: 1300,
    category: "skirts",
    size: "S",
    Stock: 12,
    images: [{ public_id: "skirt3", url: "/products/skirts/skirt3.png" }],
  },
  // Tops
  {
    name: "Basic White Tee",
    description: "Premium cotton white t-shirt, an essential wardrobe staple.",
    price: 700,
    category: "tops",
    size: "M",
    Stock: 30,
    images: [{ public_id: "tops1", url: "/products/tops/tops/tops1.png" }],
  },
  {
    name: "Striped Casual Shirt",
    description: "Breathable linen striped shirt for a relaxed summer look.",
    price: 1400,
    category: "tops",
    size: "L",
    Stock: 18,
    images: [{ public_id: "tops2", url: "/products/tops/tops/tops2.png" }],
  },
  {
    name: "Knitted Winter Sweater",
    description: "Soft wool-blend knitted sweater to keep you cozy.",
    price: 2200,
    category: "tops",
    size: "M",
    Stock: 10,
    images: [{ public_id: "tops3", url: "/products/tops/tops/tops3.png" }],
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
