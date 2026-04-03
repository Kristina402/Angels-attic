import React, { useState, useEffect } from "react";
import CheckoutSteps from "./CheckoutSteps ";
import { useSelector, useDispatch } from "react-redux";
import MetaData from "../layouts/MataData/MataData";
import { 
  Typography, 
  Box, 
  Container, 
  Grid, 
  Paper, 
  Divider, 
  Button, 
  Radio, 
  RadioGroup, 
  FormControlLabel, 
  FormControl 
} from "@material-ui/core";
import { Link, useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { dispalyMoney } from "../DisplayMoney/DisplayMoney";
import { createOrder, clearErrors } from "../../actions/orderAction";
import { useAlert } from "react-alert";

import axios from "axios";
import esewaLogo from "../../Image/payment-svg/esewa1.png";

const useStyles = makeStyles((theme) => ({
  confirmOrderPage: {
    backgroundColor: "#fdfdfd",
    minHeight: "100vh",
    paddingTop: "5rem",
    paddingBottom: "5rem",
  },
  mainContainer: {
    marginTop: "2rem",
  },
  sectionPaper: {
    padding: "2rem",
    borderRadius: "20px",
    border: "1px solid #eee",
    boxShadow: "none",
    marginBottom: "2rem",
  },
  summaryPaper: {
    padding: "2rem",
    borderRadius: "20px",
    border: "1px solid #eee",
    boxShadow: "none",
    backgroundColor: "#fafafa",
    position: "sticky",
    top: "2rem",
  },
  sectionTitle: {
    fontWeight: 800,
    marginBottom: "1.5rem",
    fontSize: "1.2rem",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },
  infoBox: {
    "& p": {
      marginBottom: "0.5rem",
      color: "#555",
      fontSize: "0.95rem",
    },
    "& b": {
      color: "#000",
      marginRight: "0.5rem",
    },
  },
  cartItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "1.5rem",
    "& img": {
      width: "80px",
      height: "100px",
      objectFit: "cover",
      borderRadius: "10px",
    },
  },
  itemInfo: {
    flex: 1,
    marginLeft: "1.5rem",
    "& a": {
      textDecoration: "none",
      color: "#000",
      fontWeight: 600,
      fontSize: "1rem",
      "&:hover": {
        color: "#EC4899",
      },
    },
  },
  summaryItem: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "1rem",
    color: "#555",
  },
  totalItem: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "1.5rem",
    fontWeight: 800,
    fontSize: "1.2rem",
    color: "#000",
  },
  placeOrderBtn: {
    backgroundColor: "#000",
    color: "#fff",
    borderRadius: "12px",
    padding: "1rem",
    fontWeight: 700,
    textTransform: "none",
    fontSize: "1rem",
    marginTop: "2rem",
    width: "100%",
    "&:hover": {
      backgroundColor: "#333",
    },
  },
  paymentMethodBox: {
    display: "flex",
    alignItems: "center",
    padding: "0.5rem 1rem",
    borderRadius: "15px",
    border: "2px solid #eee",
    transition: "all 0.3s ease",
    cursor: "pointer",
    "&:hover": {
      borderColor: "#EC4899",
      backgroundColor: "#fffafa",
    },
  },
  paymentIconBox: {
    width: "60px",
    height: "40px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginRight: "15px",
    border: "1px solid #f0f0f0",
  },
  paymentLogo: {
    width: "80px",
    height: "auto",
    marginRight: "15px",
    display: "block",
  },
  radioSelected: {
    color: "#EC4899 !important",
  },
}));

function ConfirmOrder() {
  const { shippingInfo, cartItems } = useSelector((state) => state.cart);
  const { user, loading } = useSelector((state) => state.userData);
  const { error, success, order } = useSelector((state) => state.newOrder);
  
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const alert = useAlert();

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
      setIsProcessing(false);
    }
    if (success && order) {
      history.push(`/success?id=${order.order._id}&total=${order.order.totalPrice}&status=${order.order.orderStatus}`);
    }
  }, [dispatch, error, alert, success, order, history]);

  const [paymentMethod, setPaymentMethod] = useState("ESEWA");
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = cartItems.reduce((acc, currItem) => {
    return acc + currItem.quantity * currItem.price;
  }, 0);

  const shippingCharges = subtotal > 5000 ? 0 : 200;
  const totalPrice = subtotal + shippingCharges;

  const address = [
    shippingInfo.address,
    shippingInfo.city,
    shippingInfo.state,
    shippingInfo.country
  ].filter(Boolean).join(", ") + (shippingInfo.pinCode ? ` - ${shippingInfo.pinCode}` : "");

  const processOrder = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      if (paymentMethod === "ESEWA") {
        // Create pending order first for eSewa
        const orderData = {
          shippingInfo,
          orderItems: cartItems,
          itemsPrice: subtotal,
          shippingPrice: shippingCharges,
          totalPrice: totalPrice,
          paymentInfo: {
            id: "PENDING_ESEWA",
            status: "pending",
            method: "eSewa"
          },
        };

        const { data: orderResponse } = await axios.post("/api/v1/order/new", orderData, config);
        const orderId = orderResponse.order._id;

        // Get eSewa signature
        // We use .toFixed(1) to match the backend formatting
        const formattedAmount = Number(totalPrice).toFixed(1);
        const esewaData = {
          amount: formattedAmount,
          tax_amount: "0.0",
          total_amount: formattedAmount,
          transaction_uuid: orderId.toString(),
        };

        const { data: esewaResponse } = await axios.post("/api/v1/payment/esewa/process", esewaData, config);

        // Submit form to eSewa
        const form = document.createElement("form");
        form.setAttribute("method", "POST");
        form.setAttribute("action", esewaResponse.gateway_url);

        const fields = {
          amount: esewaResponse.total_amount,
          tax_amount: "0.0",
          product_service_charge: "0.0",
          product_delivery_charge: "0.0",
          total_amount: esewaResponse.total_amount,
          transaction_uuid: esewaResponse.transaction_uuid,
          product_code: esewaResponse.product_code,
          success_url: esewaResponse.success_url,
          failure_url: esewaResponse.failure_url,
          signed_field_names: "total_amount,transaction_uuid,product_code",
          signature: esewaResponse.signature,
        };

        for (const key in fields) {
          const input = document.createElement("input");
          input.setAttribute("type", "hidden");
          input.setAttribute("name", key);
          input.setAttribute("value", fields[key]);
          form.appendChild(input);
        }

        document.body.appendChild(form);
        form.submit();
      } else {
        // Cash on Delivery
        const orderData = {
          shippingInfo,
          orderItems: cartItems,
          itemsPrice: subtotal,
          shippingPrice: shippingCharges,
          totalPrice: totalPrice,
          paymentInfo: {
            id: "Cash on Delivery",
            status: "Not Paid",
            method: "COD"
          },
        };

        dispatch(createOrder(orderData));
      }
    } catch (error) {
      alert.error(error.response ? error.response.data.message : error.message);
      setIsProcessing(false);
    }
  };


  return (
    <Box className={classes.confirmOrderPage}>
      <MetaData title="Confirm Order - Angels Attic" />
      <Container maxWidth="lg">
        <CheckoutSteps activeStep={2} />

        <Grid container spacing={4} className={classes.mainContainer}>
          <Grid item xs={12} md={8}>
            {/* Shipping Info Section */}
            <Paper className={classes.sectionPaper}>
              <Typography className={classes.sectionTitle}>Shipping Details</Typography>
              <Box className={classes.infoBox}>
                <Typography><b>Name:</b> {shippingInfo.fullName || user.name}</Typography>
                <Typography><b>Phone:</b> {shippingInfo.phoneNo}</Typography>
                <Typography><b>Email:</b> {shippingInfo.email}</Typography>
                <Typography><b>Address:</b> {address}</Typography>
              </Box>
            </Paper>

            {/* Cart Items Section */}
            <Paper className={classes.sectionPaper}>
              <Typography className={classes.sectionTitle}>Your Items</Typography>
              <Box>
                {cartItems && cartItems.map((item) => (
                  <div key={item.productId} className={classes.cartItem}>
                    <img src={item.image} alt={item.name} />
                    <div className={classes.itemInfo}>
                      <Link to={`/product/${item.productId}`}>{item.name}</Link>
                      <Typography variant="body2" color="textSecondary" style={{ marginTop: "0.5rem" }}>
                        Price: {dispalyMoney(item.price)}
                      </Typography>
                    </div>
                    <Typography style={{ fontWeight: 600 }}>
                      {item.quantity} X {dispalyMoney(item.price)} = {dispalyMoney(item.price * item.quantity)}
                    </Typography>
                  </div>
                ))}
              </Box>
            </Paper>

            {/* Payment Method Section */}
            <Paper className={classes.sectionPaper}>
              <Typography className={classes.sectionTitle}>Select Payment Method</Typography>
              <FormControl component="fieldset" style={{ width: '100%' }}>
                <RadioGroup 
                  aria-label="payment-method" 
                  name="paymentMethod" 
                  value={paymentMethod} 
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <Box 
                    className={classes.paymentMethodBox} 
                    style={{ 
                      borderColor: paymentMethod === 'ESEWA' ? '#EC4899' : '#e0e0e0',
                      backgroundColor: paymentMethod === 'ESEWA' ? '#FFF5F7' : '#fff'
                    }}
                    onClick={() => setPaymentMethod('ESEWA')}
                  >
                    <FormControlLabel 
                      value="ESEWA" 
                      control={<Radio classes={{ checked: classes.radioSelected }} color="default" />} 
                      label={
                        <Box display="flex" alignItems="center">
                          <img 
                            src={esewaLogo} 
                            alt="eSewa" 
                            className={classes.paymentLogo} 
                          />
                          <Box>
                            <Typography style={{ fontWeight: 600, color: "#000" }}>eSewa Wallet</Typography>
                            <Typography variant="body2" color="textSecondary">Pay securely using eSewa</Typography>
                          </Box>
                        </Box>
                      } 
                      style={{ width: '100%', margin: 0 }}
                    />
                  </Box>

                  <Box 
                    className={classes.paymentMethodBox} 
                    style={{ 
                      marginTop: '1.2rem',
                      borderColor: paymentMethod === 'COD' ? '#EC4899' : '#e0e0e0',
                      backgroundColor: paymentMethod === 'COD' ? '#FFF5F7' : '#fff'
                    }}
                    onClick={() => setPaymentMethod('COD')}
                  >
                    <FormControlLabel 
                      value="COD" 
                      control={<Radio classes={{ checked: classes.radioSelected }} color="default" />} 
                      label={
                        <Box display="flex" alignItems="center" style={{ marginLeft: "5px" }}>
                          <Box>
                            <Typography style={{ fontWeight: 600, color: "#000" }}>Cash on Delivery (COD)</Typography>
                            <Typography variant="body2" color="textSecondary">Pay when you receive the order</Typography>
                          </Box>
                        </Box>
                      } 
                      style={{ width: '100%', margin: 0 }}
                    />
                  </Box>
                </RadioGroup>
              </FormControl>
            </Paper>

          </Grid>

          <Grid item xs={12} md={4}>
            <Paper className={classes.summaryPaper}>
              <Typography className={classes.sectionTitle}>Order Summary</Typography>
              <Divider style={{ marginBottom: "1.5rem" }} />
              
              <Box className={classes.summaryItem}>
                <Typography>Subtotal</Typography>
                <Typography>{dispalyMoney(subtotal)}</Typography>
              </Box>
              <Box className={classes.summaryItem}>
                <Typography>Shipping Charges</Typography>
                <Typography>{dispalyMoney(shippingCharges)}</Typography>
              </Box>
              <Divider />
              <Box className={classes.totalItem}>
                <Typography>Total</Typography>
                <Typography>{dispalyMoney(totalPrice)}</Typography>
              </Box>

              <Button 
                className={classes.placeOrderBtn}
                onClick={processOrder}
                disabled={loading || isProcessing}
              >
                {isProcessing ? "Processing..." : (paymentMethod === "ESEWA" ? "Pay with eSewa" : "Place Order (COD)")}
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default ConfirmOrder;
