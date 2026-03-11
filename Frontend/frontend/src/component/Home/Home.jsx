import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Home.css";
import ProductCard from "./ProductCard";
import MataData from "../layouts/MataData/MataData";
import { clearErrors, getProduct } from "../../actions/productAction";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../layouts/loader/Loader";
import { useAlert } from "react-alert";
import { Link } from "react-router-dom";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import TuneIcon from "@mui/icons-material/Tune";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import StorefrontIcon from "@mui/icons-material/Storefront";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import PaymentIcon from "@mui/icons-material/Payment";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import PaymentsIcon from "@mui/icons-material/Payments";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import { addItemToCart } from "../../actions/cartAction";

// Animation variants for sections
const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const headingVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
};

const SectionHeading = ({ title, subtitle }) => (
  <motion.div
    className="section_heading"
    variants={headingVariants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-50px" }}
  >
    <h2 className="heading_title">{title}</h2>
    {subtitle && <p className="heading_subtitle">{subtitle}</p>}
    <div className="heading_line">
      <span className="line_accent"></span>
    </div>
  </motion.div>
);

const heroImages = [
  require("../../Image/angel/angel1.png"),
  require("../../Image/angel/angel2.png"),
  require("../../Image/angel/angel3.png"),
];

function HeroImageSlider() {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroImages.length);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hero_image_wrapper">
      <AnimatePresence mode="wait">
        <motion.img
          key={currentIndex}
          src={heroImages[currentIndex]}
          alt="Thrift clothing rack"
          className="hero_image"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />
      </AnimatePresence>
    </div>
  );
}

function Home() {
  const alert = useAlert();
  const dispatch = useDispatch();
  const { loading, error, products } = useSelector((state) => state.products);

  React.useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors);
    }
    dispatch(getProduct());
  }, [dispatch, error, alert]);

  const recentProducts = products ? products.slice(0, 8) : [];

  const whyChooseItems = [
    {
      title: "Buy & Sell Second-Hand Items",
      description: "List quality pre-loved pieces or discover unique finds from other users.",
      icon: <ShoppingBagIcon />,
    },
    {
      title: "Secure Online Payment",
      description: "Checkout flows are protected with secure payment processing.",
      icon: <PaymentIcon />,
    },
    {
      title: "Smart Search & Filters",
      description: "Quickly narrow results by size, style, price, and more.",
      icon: <TuneIcon />,
    },
    {
      title: "Add to Cart & Wishlist",
      description: "Save your favorites or move straight to purchase in one click.",
      icon: <FavoriteBorderIcon />,
    },
    {
      title: "Seller Dashboard",
      description: "Track listings, orders, and earnings from a dedicated seller space.",
      icon: <DashboardIcon />,
    },
    {
      title: "Admin Monitoring & Security",
      description: "Role-based access ensures safe, well-managed marketplace activity.",
      icon: <ShieldOutlinedIcon />,
    },
  ];

  const featuredCategories = [
    {
      key: "women",
      title: "Women’s Wear",
      image: require("../../Image/products/tops/tops/tops1.png"),
    },
    {
      key: "men",
      title: "Men’s Wear",
      image: require("../../Image/products/jackets/jacket1.png"),
    },
    {
      key: "vintage",
      title: "Vintage Collection",
      image: require("../../Image/products/skirts/skrit1.png"),
    },
    {
      key: "accessories",
      title: "Accessories",
      image: require("../../Image/products/bags/bags1.png"),
    },
    {
      key: "footwear",
      title: "Footwear",
      image: require("../../Image/products/footwares/footware1.png"),
    },
  ];

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <MataData title="Angels Attic – Online Thrift Marketplace" />
          <div className="Home_Page">
            <section className="hero_section">
              <div className="hero_inner">
                <div className="hero_left">
                  <h1 className="hero_title">Thrift Your Style Story</h1>
                  <p className="hero_subtext">
                    Angels Attic is a full-stack thrift marketplace platform that allows users
                    to buy and sell pre-loved products safely. Our mission is to promote
                    sustainable shopping by encouraging reuse and reducing waste. We connect
                    buyers and sellers in a secure, easy-to-use environment.
                  </p>
                  <div className="hero_actions">
                    <Link to="/products" className="btn_primary">
                      Shop Now
                    </Link>
                    <Link to="/signup" className="btn_secondary">
                      Start Selling
                    </Link>
                  </div>
                </div>
                <div className="hero_right">
                  <HeroImageSlider />
                </div>
              </div>
            </section>

            <motion.section
              className="recent_section"
              variants={sectionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              <SectionHeading
                title="Recently Added"
                subtitle="Fresh pre-loved arrivals from the Angels Attic community"
              />
              <motion.div
                className="recent_grid"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
              >
                {recentProducts.map((product) => (
                  <motion.div
                    key={product._id}
                    className="recent_card"
                    variants={containerVariants}
                  >
                    <div className="recent_card_image_wrapper">
                      <button className="recent_wishlist_button">
                        <FavoriteBorderIcon />
                      </button>
                      <img
                        src={product.images && product.images[0] && product.images[0].url}
                        alt={product.name}
                        className="recent_card_image"
                      />
                    </div>
                    <div className="recent_card_body">
                      <h3 className="recent_card_title">{product.name}</h3>
                      <p className="recent_card_price">Rs {product.price}</p>
                    </div>
                    <div className="recent_card_actions">
                      <Link
                        to={`/product/${product._id}`}
                        className="recent_button recent_button_outline"
                      >
                        View Details
                      </Link>
                      <button
                        className="recent_button recent_button_primary"
                        onClick={() => dispatch(addItemToCart(product._id, 1))}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
              <div className="recent_load_more_wrapper">
                <button className="recent_load_more_button">Load More</button>
              </div>
            </motion.section>

            <motion.section
              className="why_section"
              variants={sectionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              <SectionHeading
                title="Why Choose Angels Attic?"
                subtitle="Built as a complete, secure thrift marketplace experience"
              />
              <div className="why_grid">
                {whyChooseItems.map((item) => (
                  <div key={item.title} className="why_card">
                    <div className="why_icon">{item.icon}</div>
                    <h3 className="why_title">{item.title}</h3>
                    <p className="why_text">{item.description}</p>
                  </div>
                ))}
              </div>
            </motion.section>


            <motion.section
              className="categories_section"
              variants={sectionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              <SectionHeading
                title="Featured Categories"
                subtitle="Explore by style, category, and collection"
              />
              <div className="categories_grid">
                {featuredCategories.map((category) => (
                  <div key={category.key} className="category_card">
                    <div
                      className="category_image"
                      style={{ backgroundImage: `url(${category.image})` }}
                    />
                    <div className="category_overlay">
                      <h3 className="category_title">{category.title}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>

            <section className="sustainability_section">
              <div className="sustainability_inner">
                <div className="sustainability_content">
                  <h2 className="sustainability_title">
                    Shop Sustainably. Make a Difference.
                  </h2>
                  <p className="sustainability_text">
                    Every purchase supports sustainable fashion and reduces environmental waste.
                    By choosing pre-loved items, you contribute to a circular economy and
                    responsible consumption.
                  </p>
                </div>
              </div>
            </section>

            

            <section className="cta_section">
              <div className="cta_inner">
                <h2 className="cta_title">
                  Ready to refresh your wardrobe sustainably?
                </h2>
                <p className="cta_text">
                  Join Angels Attic today and start buying and selling pre-loved items in a
                  secure, full-stack thrift marketplace.
                </p>
                <Link to="/signup" className="btn_primary cta_button">
                  Join Angels Attic Today
                </Link>
              </div>
            </section>
          </div>
        </>
      )}
    </>
  );
}

export default Home;
