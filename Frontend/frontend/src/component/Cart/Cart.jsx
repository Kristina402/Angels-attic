import React, { useState } from "react";
import "./Cart.css";
import { useSelector, useDispatch } from "react-redux";
import { addItemToCart, removeItemFromCart } from "../../actions/cartAction";
import { Typography, Button, Box, Divider, Container, Grid } from "@material-ui/core";
import { Link } from "react-router-dom";
import MetaData from "../layouts/MataData/MataData";
import { useHistory } from "react-router-dom";
import CartItem from "./CartItem";
import { motion, AnimatePresence } from "framer-motion";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import {
  dispalyMoney,
  generateDiscountedPrice,
} from "../DisplayMoney/DisplayMoney";

const Cart = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);

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
    history.push("/login?redirect=/shipping");
  };

  let totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  let discountedPrice = generateDiscountedPrice(totalPrice);
  let totalDiscount = totalPrice - discountedPrice;
  let final = totalPrice - totalDiscount;

  return (
    <div className="cart_page_new">
      <MetaData title="Your Shopping Cart - Angels Attic" />
      
      <Container maxWidth="lg">
        {cartItems.length === 0 ? (
          <motion.div 
            className="empty_cart_wrapper"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="empty_cart_content">
              <div className="illustration_box">
                <ShoppingBagOutlinedIcon style={{ fontSize: "120px", color: "#e0e0e0" }} />
              </div>
              <Typography variant="h4" className="empty_cart_title">
                Your Cart is Empty
              </Typography>
              <Typography className="empty_cart_text">
                Looks like you haven't added anything to your cart yet. 
                Explore our unique collection and find something you love!
              </Typography>
              <Button 
                variant="contained" 
                className="continue_shopping_btn_large"
                onClick={() => history.push("/products")}
              >
                Continue Shopping
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
                  {cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'}
                </Typography>
              </div>
              <Button 
                startIcon={<ArrowBackIosNewIcon style={{ fontSize: '14px' }} />}
                className="back_to_shop_link"
                onClick={() => history.push("/products")}
              >
                Back to Shop
              </Button>
            </header>

            <Grid container spacing={4}>
              {/* Cart Items List */}
              <Grid item xs={12} lg={8}>
                <div className="cart_items_list">
                  <AnimatePresence>
                    {cartItems.map((item) => (
                      <motion.div
                        key={item.productId}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
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
                      <span>Subtotal</span>
                      <span>{dispalyMoney(totalPrice)}</span>
                    </div>
                    <div className="summary_row_new discount_row">
                      <span>Discount</span>
                      <span>-{dispalyMoney(totalDiscount)}</span>
                    </div>
                    <div className="summary_row_new">
                      <span>Shipping</span>
                      <span className="free_text">Free</span>
                    </div>
                    
                    <Divider className="summary_divider_new" />
                    
                    <div className="summary_row_new total_row_new">
                      <Typography variant="h6">Total</Typography>
                      <div className="total_price_box">
                        <Typography variant="h5" className="final_amount">
                          {dispalyMoney(final)}
                        </Typography>
                        <Typography className="tax_info">(Inclusive of all taxes)</Typography>
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

                  <div className="secure_checkout_badge">
                    <ShoppingBagOutlinedIcon fontSize="small" />
                    <span>Secure Checkout</span>
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
