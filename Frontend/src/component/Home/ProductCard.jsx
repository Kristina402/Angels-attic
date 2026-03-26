import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Button,
} from "@material-ui/core";
import { Box, Tooltip, Chip } from "@mui/material";
import Rating from "@material-ui/lab/Rating";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { motion } from "framer-motion";
import { Link, useHistory } from "react-router-dom";
import { dispalyMoney, generateDiscountedPrice } from "../DisplayMoney/DisplayMoney";
import { useDispatch, useSelector } from "react-redux";
import { addToWishlist, removeFromWishlist } from "../../actions/wishlistAction";
import { addItemToCart } from "../../actions/cartAction";
import { useAlert } from "react-alert";
import { colors, typography, shadows } from "../theme";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    position: "relative",
    backgroundColor: colors.neutral.white,
    borderRadius: "24px",
    overflow: "hidden",
    border: "1px solid #f2f2f2",
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    "&:hover": {
      boxShadow: "0 15px 35px rgba(0,0,0,0.08)",
      transform: "translateY(-8px)",
      "& $media": {
        transform: "scale(1.05)",
      },
    },
  },
  wishlistButton: {
    position: "absolute",
    top: "12px",
    right: "12px",
    zIndex: 2,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(8px)",
    padding: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    "&:hover": {
      backgroundColor: "#fff",
      "& $wishlistIcon": {
        color: "#ff3b30",
      },
    },
  },
  wishlistIcon: {
    fontSize: "20px",
    transition: "all 0.3s ease",
    color: "#8e8e93",
  },
  wishlistIconActive: {
    color: "#ff3b30",
  },
  mediaWrapper: {
    width: "100%",
    aspectRatio: "3/4",
    overflow: "hidden",
    backgroundColor: "#f5f5f7",
  },
  media: {
    height: "100%",
    width: "100%",
    objectFit: "cover",
    transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
  },
  cardContent: {
    padding: "20px",
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
  },
  productName: {
    fontFamily: typography.fontFamily.primary,
    fontWeight: 700,
    fontSize: "1.05rem",
    color: "#1a1a1a",
    lineHeight: 1.3,
    marginBottom: "6px",
    display: "-webkit-box",
    overflow: "hidden",
    WebkitLineClamp: 1,
    WebkitBoxOrient: "vertical",
  },
  sizeTag: {
    color: "#8e8e93",
    fontSize: "0.8rem",
    fontWeight: 600,
    textTransform: "uppercase",
    marginBottom: "8px",
    letterSpacing: "0.02em",
  },
  priceRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "12px",
  },
  finalPrice: {
    fontWeight: 800,
    fontSize: "1.15rem",
    color: "#1a1a1a",
  },
  oldPrice: {
    textDecoration: "line-through",
    color: "#aeaeb2",
    fontSize: "0.9rem",
    fontWeight: 500,
  },
  ratingBox: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    marginBottom: "16px",
  },
  rating: {
    fontSize: "14px",
  },
  reviewCount: {
    fontSize: "12px",
    color: "#8e8e93",
    fontWeight: 500,
  },
  actions: {
    display: "flex",
    gap: "8px",
    marginTop: "auto",
    justifyContent: "center",
    alignItems: "center",
    padding: "0 12px 16px",
  },
  btnDetails: {
    flex: 1,
    borderRadius: "14px !important",
    textTransform: "none !important",
    fontWeight: "700 !important",
    fontSize: "0.85rem !important",
    padding: "8px !important",
    color: "#1a1a1a !important",
    border: "1.5px solid #f2f2f2 !important",
    "&:hover": {
      backgroundColor: "#fdfdfd !important",
      borderColor: "#1a1a1a !important",
    },
  },
  btnCart: {
    backgroundColor: "#1a1a1a !important",
    color: "#fff !important",
    padding: "10px !important",
    borderRadius: "12px !important",
    minWidth: "44px !important",
    width: "44px !important",
    height: "44px !important",
    "&:hover": {
      backgroundColor: "#000 !important",
      boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
    },
    "&:disabled": {
      backgroundColor: "#f5f5f7 !important",
      color: "#aeaeb2 !important",
    },
  },
  cartIcon: {
    fontSize: "20px",
  },
}));

const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4 }
  }
};

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const history = useHistory();
  const classes = useStyles();
  
  const { wishlistItems } = useSelector((state) => state.wishlist);
  const { isAuthenticated } = useSelector((state) => state.userData);
  const isItemInWishlist = wishlistItems.find((i) => i.productId === product._id);
  const isSold = product.availabilityStatus === "Sold";

  const oldPrice = dispalyMoney(product.price + (product.discount || 0));
  const finalPrice = dispalyMoney(product.price);

  const wishlistHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      alert.error("Please login to use wishlist");
      history.push("/login");
      return;
    }

    if (isItemInWishlist) {
      dispatch(removeFromWishlist(product._id));
    } else {
      dispatch(addToWishlist(product._id));
      alert.success("Added to wishlist");
    }
  };

  const addToCartHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      alert.error("Please login to add items to cart");
      history.push("/login");
      return;
    }

    if (isSold) {
      alert.error("Item is already sold");
      return;
    }
    dispatch(addItemToCart(product._id, 1));
    alert.success("Item added to cart");
  };

  return (
    <motion.div variants={cardVariants} initial="initial" animate="animate" style={{ height: "100%" }}>
      <Card className={classes.root} elevation={0}>
        <Tooltip title={isItemInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}>
          <IconButton className={classes.wishlistButton} onClick={wishlistHandler}>
            {isItemInWishlist ? (
              <FavoriteIcon className={`${classes.wishlistIcon} ${classes.wishlistIconActive}`} />
            ) : (
              <FavoriteBorderIcon className={classes.wishlistIcon} />
            )}
          </IconButton>
        </Tooltip>

        <Link to={`/product/${product._id}`} style={{ textDecoration: "none", color: "inherit", display: "flex", flexDirection: "column", height: "100%" }}>
          <CardActionArea style={{ display: "flex", flexDirection: "column", alignItems: "stretch", flexGrow: 1 }}>
            <div className={classes.mediaWrapper}>
              <CardMedia className={classes.media} image={product.images[0].url} title={product.name} />
              {isSold && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1,
                  }}
                >
                  <Typography
                    sx={{
                      color: '#fff',
                      fontWeight: 800,
                      fontSize: '1.2rem',
                      textTransform: 'uppercase',
                      border: '2px solid #fff',
                      padding: '8px 16px',
                      borderRadius: '4px',
                      transform: 'rotate(-15deg)',
                    }}
                  >
                    Sold Out
                  </Typography>
                </Box>
              )}
            </div>
            <CardContent className={classes.cardContent}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography className={classes.sizeTag}>Size: {product.size}</Typography>
                <Chip 
                  label={product.condition} 
                  size="small" 
                  sx={{ 
                    fontSize: '0.6rem', 
                    height: '18px', 
                    backgroundColor: '#F3F4F6',
                    color: '#4B5563',
                    fontWeight: 600,
                    textTransform: 'uppercase'
                  }} 
                />
              </Box>
              <Typography className={classes.productName}>{product.name}</Typography>
              
              <Box className={classes.priceRow}>
                <Typography className={classes.finalPrice}>{finalPrice}</Typography>
                {product.discount > 0 && (
                  <Typography className={classes.oldPrice}>{oldPrice}</Typography>
                )}
              </Box>

              <Box className={classes.ratingBox}>
                <Rating value={product.ratings} precision={0.1} readOnly size="small" className={classes.rating} />
                <Typography className={classes.reviewCount}>({product.numOfReviews})</Typography>
              </Box>

              <div className={classes.actions}>
                <Button className={classes.btnDetails} variant="outlined">
                  View Details
                </Button>
                <Tooltip title={isSold ? "Sold Out" : "Add to Cart"}>
                  <span>
                    <IconButton 
                      className={classes.btnCart}
                      onClick={addToCartHandler}
                      disabled={isSold}
                    >
                      <AddShoppingCartIcon className={classes.cartIcon} />
                    </IconButton>
                  </span>
                </Tooltip>
              </div>
            </CardContent>
          </CardActionArea>
        </Link>
      </Card>
    </motion.div>
  );
};

export default ProductCard;
