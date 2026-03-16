import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useAlert } from "react-alert";
import { useHistory } from "react-router-dom";
import MetaData from "../layouts/MataData/MataData";
import CheckoutSteps from "./CheckoutSteps ";
import {
  Typography,
  Box,
  Container,
  Grid,
  Paper,
  TextField,
  Button,
  Divider,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  IconButton,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import { dispalyMoney } from "../DisplayMoney/DisplayMoney";
import { saveShippingInfo } from "../../actions/cartAction";
import { createOrder, clearErrors } from "../../actions/orderAction";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import Loader from "../layouts/loader/Loader";

const useStyles = makeStyles((theme) => ({
  checkoutPage: {
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
  inputField: {
    marginBottom: "1.5rem",
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
    },
  },
  cartItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "1.5rem",
    "& img": {
      width: "60px",
      height: "80px",
      objectFit: "cover",
      borderRadius: "8px",
    },
  },
  itemInfo: {
    flex: 1,
    marginLeft: "1rem",
    "& a": {
      textDecoration: "none",
      color: "#000",
      fontWeight: 600,
      fontSize: "0.9rem",
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

const Checkout = () => {
  const classes = useStyles();
  const alert = useAlert();
  const dispatch = useDispatch();
  const history = useHistory();

  const { shippingInfo, cartItems } = useSelector((state) => state.cart);
  const { user, isAuthenticated } = useSelector((state) => state.userData);
  const { error, loading } = useSelector((state) => state.newOrder);

  const [fullName, setFullName] = useState(shippingInfo.fullName || (user ? user.name : ""));
  const [email, setEmail] = useState(shippingInfo.email || (user ? user.email : ""));
  const [phoneNo, setPhoneNo] = useState(shippingInfo.phoneNo || "");
  const [address, setAddress] = useState(shippingInfo.address || "");
  const [city, setCity] = useState(shippingInfo.city || "");
  const [paymentMethod, setPaymentMethod] = useState("COD");

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingCharges = subtotal > 5000 ? 0 : 200;
  const totalPrice = subtotal + shippingCharges;

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, error, alert]);

  const handlePlaceOrder = (e) => {
    e.preventDefault();

    if (!fullName || !email || !phoneNo || !address || !city) {
      alert.error("Please fill all shipping information fields");
      return;
    }

    if (phoneNo.length !== 10) {
      alert.error("Phone Number should be 10 digits");
      return;
    }

    const orderData = {
      shippingInfo: {
        fullName,
        email,
        phoneNo,
        address,
        city,
        country: "India",
      },
      orderItems: cartItems,
      itemsPrice: subtotal,
      shippingPrice: shippingCharges,
      totalPrice: totalPrice,
      paymentInfo: {
        id: paymentMethod === "COD" ? "Cash on Delivery" : "Online Payment",
        status: paymentMethod === "COD" ? "Pending" : "Succeeded",
      },
    };

    // Save shipping info for future use
    dispatch(saveShippingInfo(orderData.shippingInfo));

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

  if (cartItems.length === 0) {
    history.push("/cart");
    return null;
  }

  return (
    <Box className={classes.checkoutPage}>
      <MetaData title="Checkout - Angels Attic" />
      <Container maxWidth="lg">
        <CheckoutSteps activeStep={1} />

        <form onSubmit={handlePlaceOrder}>
          <Grid container spacing={4} className={classes.mainContainer}>
            <Grid item xs={12} md={8}>
              {/* Shipping Information Section */}
              <Paper className={classes.sectionPaper}>
                <Typography className={classes.sectionTitle}>Shipping Information</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      variant="outlined"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className={classes.inputField}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      variant="outlined"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={classes.inputField}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      variant="outlined"
                      value={phoneNo}
                      onChange={(e) => setPhoneNo(e.target.value)}
                      className={classes.inputField}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="City"
                      variant="outlined"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className={classes.inputField}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Complete Address"
                      variant="outlined"
                      multiline
                      rows={3}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className={classes.inputField}
                      required
                    />
                  </Grid>
                </Grid>
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

                <Box style={{ maxHeight: "300px", overflowY: "auto", marginBottom: "1.5rem" }}>
                  {cartItems.map((item) => (
                    <div key={item.productId} className={classes.cartItem}>
                      <img src={item.image} alt={item.name} />
                      <div className={classes.itemInfo}>
                        <Link to={`/product/${item.productId}`}>{item.name}</Link>
                        <Typography variant="body2" color="textSecondary">
                          {dispalyMoney(item.price)}
                        </Typography>
                      </div>
                    </div>
                  ))}
                </Box>

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
                  type="submit"
                  className={classes.placeOrderBtn}
                  disabled={loading}
                >
                  {paymentMethod === "COD" ? "Place Order" : "Proceed to Payment"}
                </Button>

                <Button
                  fullWidth
                  style={{ marginTop: "1rem", textTransform: "none", color: "#666" }}
                  startIcon={<ArrowBackIosNewIcon style={{ fontSize: "12px" }} />}
                  onClick={() => history.push("/cart")}
                >
                  Back to Cart
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </form>
      </Container>
    </Box>
  );
};

export default Checkout;
