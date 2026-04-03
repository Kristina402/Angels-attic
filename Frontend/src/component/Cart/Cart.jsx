import React, { useState, useEffect } from "react";
import { useAlert } from "react-alert";
import "./Cart.css";
import { useSelector, useDispatch } from "react-redux";
import { addItemToCart, removeItemFromCart } from "../../actions/cartAction";
import { Typography, Button, Box, Divider, Container, Grid } from "@material-ui/core";
import { Link } from "react-router-dom";
import MetaData from "../layouts/MataData/MataData";
import { useHistory, useLocation } from "react-router-dom";
import CartItem from "./CartItem";
import { motion, AnimatePresence } from "framer-motion";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import {
  dispalyMoney,
  generateDiscountedPrice,
} from "../DisplayMoney/DisplayMoney";

const Cart = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);
  const location = useLocation();
  const alert = useAlert();
  const { isAuthenticated } = useSelector((state) => state.userData);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    if (queryParams.get("payment") === "failed") {
      alert.error("Payment Failed. Please try again.");
      
      // Clear the query parameter to avoid showing the alert again on refresh
      const { pathname, search } = location;
      const params = new URLSearchParams(search);
      params.delete("payment");
      const newSearch = params.toString() ? `?${params.toString()}` : "";
      history.replace({ pathname, search: newSearch });
    }
  }, [location, alert, history]);

  const increaseQuantity = (id, quantity, stock) => {
    const newQty = quantity + 1;
    if (stock <= quantity) return;
    dispatch(addItemToCart(id, newQty));
  };

  const decreaseQuantity = (id, quantity) => {
    const newQty = quantity - 1;
    if (1 >= quantity) return;
    dispatch(addItemToCart(id, newQty));
  };

  const deleteCartItems = (id) => {
    dispatch(removeItemFromCart(id));
  };

  const checkoutHandler = () => {
    if (isAuthenticated) {
      history.push("/shipping");
    } else {
      history.push("/login?redirect=/shipping");
    }
  };

  let totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  let totalDiscount = cartItems.reduce(
    (acc, item) => acc + (item.discount || 0) * item.quantity,
    0
  );
  let final = totalPrice - totalDiscount;

  return (
    <div className="cart_page_new">
      <MetaData title="Shopping Cart - Angels Attic" />

      <Container maxWidth="lg">
        {cartItems.length === 0 ? (
          <motion.div
            className="empty_cart_wrapper"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="empty_cart_content">
              <div className="illustration_box">
                <ShoppingBagOutlinedIcon style={{ fontSize: "100px", color: "#f0f0f0" }} />
              </div>
              <Typography variant="h4" className="empty_cart_title">
                Your cart is empty
              </Typography>
              <Typography className="empty_cart_text">
                Looks like you haven't added any thrift finds yet.
                Start exploring our unique collection!
              </Typography>
              <Button
                variant="contained"
                className="continue_shopping_btn_large"
                onClick={() => history.push("/products")}
              >
                Start Shopping
              </Button>
            </div>
          </motion.div>
        ) : (
          <div className="cart_main_container">
            <header className="cart_header_new">
              <div className="cart_header_left">
                <Typography variant="h4" className="cart_main_title">
                  Shopping Cart
                </Typography>
                <Typography className="cart_count_badge">
                  {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
                </Typography>
              </div>
              <Button
                component={Link}
                to="/products"
                startIcon={<ArrowBackIosNewIcon style={{ fontSize: '12px' }} />}
                className="back_to_shop_link"
              >
                Continue Shopping
              </Button>
            </header>

            <Grid container spacing={4}>
              {/* Cart Items List */}
              <Grid item xs={12} lg={8}>
                <div className="cart_items_list">
                  <AnimatePresence mode="popLayout">
                    {cartItems.map((item) => (
                      <motion.div
                        key={item.productId}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.4 }}
                      >
                        <CartItem
                          item={item}
                          deleteCartItems={deleteCartItems}
                          decreaseQuantity={decreaseQuantity}
                          increaseQuantity={increaseQuantity}
                          id={item.productId}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </Grid>

              {/* Order Summary Sidebar */}
              <Grid item xs={12} lg={4}>
                <div className="order_summary_card_new">
                  <Typography variant="h6" className="summary_title_new">
                    Order Summary
                  </Typography>

                  <div className="summary_details_new">
                    <div className="summary_row_new">
                      <span className="label">Cart Subtotal</span>
                      <span className="value">{dispalyMoney(totalPrice)}</span>
                    </div>
                    {totalDiscount > 0 && (
                      <div className="summary_row_new discount_row">
                        <span className="label">Savings</span>
                        <span className="value">-{dispalyMoney(totalDiscount)}</span>
                      </div>
                    )}
                    <div className="summary_row_new">
                      <span className="label">Shipping</span>
                      <span className="value free_text">Calculated at checkout</span>
                    </div>

                    <Divider className="summary_divider_new" />

                    <div className="summary_row_new total_row_new">
                      <Typography variant="h6" className="total_label">Estimated Total</Typography>
                      <div className="total_price_box">
                        <Typography variant="h5" className="final_amount">
                          {dispalyMoney(final)}
                        </Typography>
                        <Typography className="tax_info">Taxes included</Typography>
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="contained"
                    className="checkout_btn_new"
                    onClick={checkoutHandler}
                    fullWidth
                  >
                    Proceed to Checkout
                  </Button>

                  <div className="summary_features">
                    <div className="feature_item">
                      <SecurityOutlinedIcon fontSize="small" />
                      <span>Secure Payment</span>
                    </div>
                    <div className="feature_item">
                      <LocalShippingOutlinedIcon fontSize="small" />
                      <span>Fast Delivery</span>
                    </div>
                  </div>
                </div>
              </Grid>
            </Grid>
          </div>
        )}
      </Container>
    </div>
  );
};

export default Cart;
