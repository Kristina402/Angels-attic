import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
} from "@material-ui/core";
import Rating from "@material-ui/lab/Rating";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { dispalyMoney, generateDiscountedPrice } from "../DisplayMoney/DisplayMoney";
import { addItemToCart } from "../../actions/cartAction";
import { useDispatch } from "react-redux";
import { colors, typography, shadows } from "../theme";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "280px",
    height: "auto",
    margin: theme.spacing(1.5),
    backgroundColor: colors.neutral.white,
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: shadows.card,
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    "&:hover": {
      boxShadow: shadows.cardHover,
    },
  },
  media: {
    height: 200,
    width: "90%",
    objectFit: "contain",
    margin: "1rem auto 0",
    borderRadius: "12px",
    backgroundColor: colors.neutral.offWhite,
    transition: "transform 0.3s ease",
  },
  cardContent: {
    padding: theme.spacing(2),
  },
  productName: {
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.weight.medium,
    fontSize: "14px",
    color: colors.neutral.black,
    lineHeight: 1.2,
    marginBottom: theme.spacing(0.5),
    display: "-webkit-box",
    overflow: "hidden",
    textOverflow: "ellipsis",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    minHeight: "2.4em",
    padding: "0 4px",
  },
  ratingBox: {
    display: "flex",
    alignItems: "center",
    marginBottom: theme.spacing(0.5),
    padding: "0 4px",
  },
  rating: {
    color: "#ffA41C",
    fontSize: "12px",
  },
  reviewCount: {
    fontFamily: typography.fontFamily.secondary,
    fontSize: "11px",
    color: colors.neutral.gray,
  },
  description: {
    display: "none",
  },
  priceBox: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
    padding: "0 4px",
  },
  oldPrice: {
    fontFamily: typography.fontFamily.primary,
    textDecoration: "line-through",
    color: colors.neutral.gray,
    fontSize: "12px",
  },
  finalPrice: {
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.weight.bold,
    fontSize: "16px",
    color: colors.primary.main,
  },
  discountBadge: {
    fontSize: "12px",
    color: colors.neutral.gray,
    marginLeft: "5px",
  },
  buttonWrapper: {
    padding: theme.spacing(0, 2, 2, 2),
  },
  button: {
    backgroundColor: colors.neutral.black,
    color: colors.neutral.white,
    borderRadius: "50px",
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.weight.semiBold,
    width: "100%",
    height: 45,
    textTransform: "none",
    fontSize: typography.size.sm,
    letterSpacing: "0.5px",
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: colors.primary.main,
      color: colors.neutral.white,
      transform: "translateY(-2px)",
      boxShadow: `0 4px 15px rgba(227, 6, 5, 0.3)`,
    },
  },
}));

// Animation variants
const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" }
  },
  hover: {
    y: -8,
    transition: { duration: 0.3, ease: "easeOut" }
  }
};

const buttonVariants = {
  hover: {
    scale: 1.02,
    transition: { duration: 0.2 }
  },
  tap: {
    scale: 0.98
  }
};

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  let discountPrice = generateDiscountedPrice(product.price);
  discountPrice = dispalyMoney(discountPrice);
  const oldPrice = dispalyMoney(product.price);

  const addTocartHandler = (id, qty) => {
    dispatch(addItemToCart(id, qty));
  };

  const discountPercent = Math.round(
    ((product.price - generateDiscountedPrice(product.price)) / product.price) * 100
  );

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
    >
      <Card className={classes.root} elevation={0}>
        <Link
          className="productCard"
          to={`/product/${product._id}`}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <CardActionArea>
            <CardMedia className={classes.media} image={product.images[0].url} />
            <CardContent className={classes.cardContent}>
              <Typography className={classes.productName}>
                {product.name}
              </Typography>
              
              <Box className={classes.priceBox}>
                <Typography className={classes.finalPrice}>
                  {discountPrice}
                </Typography>
                <Box style={{ display: "flex", alignItems: "center" }}>
                  <Typography className={classes.oldPrice}>
                    {oldPrice}
                  </Typography>
                  <Typography className={classes.discountBadge}>
                    -{discountPercent}%
                  </Typography>
                </Box>
              </Box>

              <Box className={classes.ratingBox}>
                <Rating
                  name="rating"
                  value={product.ratings}
                  precision={0.1}
                  readOnly
                  size="small"
                  className={classes.rating}
                />
                <Typography className={classes.reviewCount}>
                  ({product.numOfReviews})
                </Typography>
              </Box>
            </CardContent>
          </CardActionArea>
        </Link>
      </Card>
    </motion.div>
  );
};

export default ProductCard;
