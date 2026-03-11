import React from "react";
import "./Wishlist.css";
import { useSelector, useDispatch } from "react-redux";
import { removeFromWishlist } from "../../actions/wishlistAction";
import { Typography, Button, Container, Grid } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import MetaData from "../layouts/MataData/MataData";
import { motion, AnimatePresence } from "framer-motion";
import FavoriteIcon from "@mui/icons-material/Favorite";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Link } from "react-router-dom";
import { dispalyMoney } from "../DisplayMoney/DisplayMoney";

const Wishlist = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { wishlistItems } = useSelector((state) => state.wishlist);

  const deleteWishlistItems = (id) => {
    dispatch(removeFromWishlist(id));
  };

  return (
    <div className="wishlist_page">
      <MetaData title="Your Wishlist - Angels Attic" />
      
      <Container maxWidth="lg">
        {wishlistItems.length === 0 ? (
          <motion.div 
            className="empty_wishlist_wrapper"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="empty_wishlist_content">
              <div className="illustration_box">
                <FavoriteIcon style={{ fontSize: "120px", color: "#e0e0e0" }} />
              </div>
              <Typography variant="h4" className="empty_wishlist_title">
                Your wishlist is empty.
              </Typography>
              <Typography className="empty_wishlist_text">
                No items in your wishlist yet. You haven't added any products to your wishlist.
              </Typography>
              <Button 
                variant="contained" 
                className="continue_shopping_btn_large"
                onClick={() => history.push("/products")}
              >
                Explore Products
              </Button>
            </div>
          </motion.div>
        ) : (
          <div className="wishlist_main_container">
            <header className="wishlist_header">
              <div className="wishlist_header_left">
                <Typography variant="h4" className="wishlist_main_title">
                  My Wishlist
                </Typography>
                <Typography className="wishlist_count_badge">
                  {wishlistItems.length} {wishlistItems.length === 1 ? 'Item' : 'Items'}
                </Typography>
              </div>
            </header>

            <Grid container spacing={3}>
              <AnimatePresence>
                {wishlistItems.map((item) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={item.productId}>
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      className="wishlist_item_card"
                    >
                      <div className="wishlist_image_box">
                        <Link to={`/product/${item.productId}`}>
                          <img src={item.image} alt={item.name} className="wishlist_img" />
                        </Link>
                        <button 
                          className="wishlist_remove_btn"
                          onClick={() => deleteWishlistItems(item.productId)}
                        >
                          <DeleteOutlineIcon />
                        </button>
                      </div>
                      <div className="wishlist_details">
                        <Link to={`/product/${item.productId}`} className="wishlist_item_name">
                          <Typography variant="subtitle1">{item.name}</Typography>
                        </Link>
                        <Typography className="wishlist_item_price">
                          {dispalyMoney(item.price)}
                        </Typography>
                        <Button 
                          variant="outlined" 
                          className="view_product_btn"
                          onClick={() => history.push(`/product/${item.productId}`)}
                        >
                          View Product
                        </Button>
                      </div>
                    </motion.div>
                  </Grid>
                ))}
              </AnimatePresence>
            </Grid>
          </div>
        )}
      </Container>
    </div>
  );
};

export default Wishlist;
