import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouteMatch, useHistory } from "react-router-dom";
import { useAlert } from "react-alert";
import MetaData from "../layouts/MataData/MataData";
import {
  clearErrors,
  getProductDetails,
  getProduct,
} from "../../actions/productAction";
import { addItemToCart } from "../../actions/cartAction";
import { addToWishlist, removeFromWishlist } from "../../actions/wishlistAction";
import CricketBallLoader from "../layouts/loader/Loader";
import { dispalyMoney } from "../DisplayMoney/DisplayMoney";
import ProductCard from "../Home/ProductCard";

import {
  Container,
  Grid,
  Typography,
  Button,
  Box,
  IconButton,
  Divider,
  Chip,
} from "@material-ui/core";
import Rating from "@material-ui/lab/Rating";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import ReplayOutlinedIcon from "@mui/icons-material/ReplayOutlined";

import "./ProductDetails.css";

const ProductDetails = () => {
  const match = useRouteMatch();
  const dispatch = useDispatch();
  const alert = useAlert();
  const history = useHistory();

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const { product, loading, error } = useSelector((state) => state.productDetails);
  const { wishlistItems } = useSelector((state) => state.wishlist);
  const { products: relatedProducts } = useSelector((state) => state.products);

  const isItemInWishlist = wishlistItems.find((i) => i.productId === match.params.id);

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    dispatch(getProductDetails(match.params.id));
  }, [dispatch, match.params.id, error, alert]);

  useEffect(() => {
    if (product && product.category) {
      dispatch(getProduct("", 1, [0, 100000], product.category));
    }
  }, [dispatch, product]);

  const addToCartHandler = () => {
    dispatch(addItemToCart(match.params.id, quantity));
    alert.success("Item added to bag");
  };

  const wishlistHandler = () => {
    if (isItemInWishlist) {
      dispatch(removeFromWishlist(match.params.id));
      alert.success("Removed from wishlist");
    } else {
      dispatch(addToWishlist(match.params.id));
      alert.success("Added to wishlist");
    }
  };

  const increaseQuantity = () => {
    if (product.Stock <= quantity) return;
    setQuantity(quantity + 1);
  };

  const decreaseQuantity = () => {
    if (1 >= quantity) return;
    setQuantity(quantity - 1);
  };

  if (loading || !product || !product.images) return <CricketBallLoader />;

  return (
    <Box className="product_details_page">
      <MetaData title={`${product.name} - Angels Attic`} />
      
      <Container maxWidth="lg" className="product_details_container">
        <Grid container spacing={6}>
          {/* Left Column: Image Gallery */}
          <Grid item xs={12} md={7}>
            <Box className="image_gallery_wrapper">
              <Grid container spacing={2}>
                <Grid item xs={2}>
                  <Box className="thumbnail_stack">
                    {product.images.map((img, i) => (
                      <Box 
                        key={i}
                        className={`thumbnail_item ${selectedImage === i ? "active" : ""}`}
                        onClick={() => setSelectedImage(i)}
                      >
                        <img src={img.url} alt={`product-${i}`} />
                      </Box>
                    ))}
                  </Box>
                </Grid>
                <Grid item xs={10}>
                  <Box className="main_image_container">
                    <img src={product.images[selectedImage].url} alt={product.name} />
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Grid>

          {/* Right Column: Product Info */}
          <Grid item xs={12} md={5}>
            <Box className="product_info_wrapper">
              <Typography variant="overline" className="product_category_tag">
                {product.category}
              </Typography>
              <Typography variant="h3" className="product_name_title">
                {product.name}
              </Typography>
              
              <Box className="rating_row">
                <Rating value={product.ratings} precision={0.5} readOnly size="small" />
                <Typography variant="body2" color="textSecondary">
                  ({product.numOfReviews} reviews)
                </Typography>
              </Box>

              <Box className="price_row">
                <Typography variant="h4" className="current_price">
                  {dispalyMoney(product.price)}
                </Typography>
                {product.discount > 0 && (
                  <Typography variant="h6" className="old_price">
                    {dispalyMoney(product.price + product.discount)}
                  </Typography>
                )}
                <Chip 
                  label={product.condition || "Pre-loved"} 
                  className="condition_chip"
                  size="small"
                />
              </Box>

              <Divider className="info_divider" />

              <Box className="product_specs">
                <Box className="spec_item">
                  <Typography variant="subtitle2">Size:</Typography>
                  <Typography variant="body1">{product.size}</Typography>
                </Box>
                <Box className="spec_item">
                  <Typography variant="subtitle2">Availability:</Typography>
                  <Typography 
                    variant="body1" 
                    className={product.Stock < 1 ? "out_of_stock" : "in_stock"}
                  >
                    {product.Stock < 1 ? "Sold Out" : product.Stock === 1 ? "Only 1 item available!" : "In Stock"}
                  </Typography>
                </Box>
              </Box>

              <Typography variant="body1" className="product_description_text">
                {product.description}
              </Typography>

              <Box className="purchase_actions">
                <Box className="quantity_selector">
                  <IconButton onClick={decreaseQuantity} size="small">
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                  <Typography className="quantity_value">{quantity}</Typography>
                  <IconButton onClick={increaseQuantity} size="small">
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Box>

                <Box className="button_group">
                  <Button
                    variant="contained"
                    className="add_to_cart_btn"
                    onClick={addToCartHandler}
                    disabled={product.Stock < 1}
                    startIcon={<ShoppingBagOutlinedIcon />}
                  >
                    Add to Bag
                  </Button>
                  <Button
                    variant="outlined"
                    className={`wishlist_btn ${isItemInWishlist ? "active" : ""}`}
                    onClick={wishlistHandler}
                    startIcon={isItemInWishlist ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                  >
                    {isItemInWishlist ? "Added to Wishlist" : "Add to Wishlist"}
                  </Button>
                </Box>
              </Box>

              <Box className="trust_badges">
                <Box className="badge_item">
                  <VerifiedUserOutlinedIcon />
                  <Typography variant="caption">100% Authentic</Typography>
                </Box>
                <Box className="badge_item">
                  <LocalShippingOutlinedIcon />
                  <Typography variant="caption">Fast Shipping</Typography>
                </Box>
                <Box className="badge_item">
                  <ReplayOutlinedIcon />
                  <Typography variant="caption">Easy Returns</Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Related Products Section */}
        <Box className="related_products_section">
          <Typography variant="h5" className="section_title">
            You might also like
          </Typography>
          <Grid container spacing={3}>
            {relatedProducts && 
              relatedProducts
                .filter(p => p._id !== product._id)
                .slice(0, 4)
                .map((p) => (
                  <Grid item key={p._id} xs={12} sm={6} md={3}>
                    <ProductCard product={p} />
                  </Grid>
                ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default ProductDetails;
