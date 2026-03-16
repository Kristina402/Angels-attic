import React, { useState } from "react";
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
import Loader from "../layouts/loader/Loader";
import { createOrder, clearErrors } from "../../actions/orderAction";
import { useAlert } from "react-alert";

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
    marginTop: "1rem",
    padding: "1rem",
    borderRadius: "12px",
    border: "1px solid #e0e0e0",
    backgroundColor: "#fff",
  },
}));

function ConfirmOrder() {
  const { shippingInfo, cartItems } = useSelector((state) => state.cart);
  const { user, loading } = useSelector((state) => state.userData);
  const { error } = useSelector((state) => state.newOrder);
  
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const alert = useAlert();

  const [paymentMethod, setPaymentMethod] = useState("COD");

  const subtotal = cartItems.reduce((acc, currItem) => {
    return acc + currItem.quantity * currItem.price;
  }, 0);

  const shippingCharges = subtotal > 5000 ? 0 : 200;
  const totalPrice = subtotal + shippingCharges;

  const address = `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.country}`;

  const processOrder = async () => {
    const orderData = {
      shippingInfo,
      orderItems: cartItems,
      itemsPrice: subtotal,
      shippingPrice: shippingCharges,
      totalPrice: totalPrice,
      paymentInfo: {
        id: paymentMethod === "COD" ? "Cash on Delivery" : "Online Payment",
        status: paymentMethod === "COD" ? "Pending" : "Succeeded",
      },
    };

    if (paymentMethod === "COD") {
      dispatch(createOrder(orderData));
      history.push("/success");
    } else {
      // For Online Payment, save order info and proceed to payment page
      const data = {
        subtotal,
        shippingCharges,
        totalPrice,
      };
      sessionStorage.setItem("orderInfo", JSON.stringify(data));
      history.push("/process/payment");
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
              <Typography className={classes.sectionTitle}>Payment Method</Typography>
              <Box className={classes.paymentMethodBox}>
                <FormControl component="fieldset">
                  <RadioGroup 
                    value={paymentMethod} 
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <FormControlLabel 
                      value="COD" 
                      control={<Radio color="default" />} 
                      label="Cash on Delivery (COD)" 
                    />
                    <FormControlLabel 
                      value="Online" 
                      control={<Radio color="default" />} 
                      label="Online Payment (Card/UPI)" 
                    />
                  </RadioGroup>
                </FormControl>
              </Box>
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
              >
                {paymentMethod === "COD" ? "Place Order" : "Proceed to Payment"}
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default ConfirmOrder;
