import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { saveShippingInfo } from "../../actions/cartAction";
import MetaData from "../layouts/MataData/MataData";
import CheckoutSteps from "./CheckoutSteps ";
import { useAlert } from "react-alert";
import { useHistory } from "react-router-dom";
import {
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Box,
  Paper,
  Divider,
  Container,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import HomeIcon from "@mui/icons-material/Home";
import StorefrontIcon from "@mui/icons-material/Storefront";
import { dispalyMoney } from "../DisplayMoney/DisplayMoney";
import { Radio, RadioGroup } from "@material-ui/core";


const useStyles = makeStyles((theme) => ({
  shippingPage: {
    backgroundColor: "#fdfdfd",
    minHeight: "100vh",
    paddingTop: "5rem",
    paddingBottom: "5rem",
  },
  mainContainer: {
    marginTop: "2rem",
  },
  formPaper: {
    padding: "2.5rem",
    borderRadius: "20px",
    border: "1px solid #eee",
    boxShadow: "none",
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
  inputField: {
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      backgroundColor: "#fff",
      "& fieldset": {
        borderColor: "#e0e0e0",
      },
      "&:hover fieldset": {
        borderColor: "#000",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#000",
      },
    },
  },
  btnPrimary: {
    backgroundColor: "#000",
    color: "#fff",
    borderRadius: "12px",
    padding: "1rem 2rem",
    fontWeight: 700,
    textTransform: "none",
    fontSize: "1rem",
    "&:hover": {
      backgroundColor: "#333",
    },
    [theme.breakpoints.down("xs")]: {
      width: "100%",
    },
  },
  btnSecondary: {
    color: "#000",
    textTransform: "none",
    fontWeight: 600,
    fontSize: "0.9rem",
    "&:hover": {
      backgroundColor: "transparent",
      textDecoration: "underline",
    },
  },
  summaryTitle: {
    fontWeight: 800,
    marginBottom: "1.5rem",
    fontSize: "1.2rem",
  },
  summaryItem: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "1rem",
  },
  totalItem: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "1.5rem",
    fontWeight: 800,
    fontSize: "1.1rem",
  },
  deliveryOption: {
    padding: "1rem",
    borderRadius: "12px",
    border: "1px solid #eee",
    marginBottom: "1rem",
    cursor: "pointer",
    transition: "all 0.2s ease",
    "&:hover": {
      borderColor: "#000",
    },
  },
  selectedDelivery: {
    borderColor: "#000",
    backgroundColor: "#f9f9f9",
  },
}));


const Shipping = () => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const history = useHistory();
  const { shippingInfo, cartItems } = useSelector((state) => state.cart);

  const classes = useStyles();
  const { user } = useSelector((state) => state.userData);

  const [address, setAddress] = React.useState(shippingInfo.address || (user && user.address) || "");
  const [fullName, setFullName] = React.useState(shippingInfo.fullName || (user && user.name) || "");
  const [city, setCity] = React.useState(shippingInfo.city || "");
  const [phoneNo, setPhone] = React.useState(shippingInfo.phoneNo || (user && user.phone) || "");
  const [email, setEmail] = React.useState(shippingInfo.email || (user && user.email) || "");
  const [deliveryType, setDeliveryType] = React.useState(shippingInfo.deliveryType || "home");

  // Update fields if user data becomes available (e.g., after loading)
  React.useEffect(() => {
    if (user && !shippingInfo.address) {
      if (!fullName) setFullName(user.name || "");
      if (!email) setEmail(user.email || "");
      if (!address) setAddress(user.address || "");
      if (!phoneNo) setPhone(user.phone || "");
    }
  }, [user, shippingInfo.address, fullName, email, address, phoneNo]);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const deliveryFeeArray = {
    home: 170,
    pickup: 120
  };
  const deliveryFee = deliveryFeeArray[deliveryType];
  const totalPrice = subtotal + deliveryFee;


  const handleSubmit = (event) => {
    event.preventDefault();

    if (!email || !fullName || !address || !city || !phoneNo) {
      alert.error("Please fill all the fields");
      return;
    }

    const cleanedPhone = phoneNo.trim().replace(/^(\+977|977|\+91|91)/, "").replace(/\s+/g, "");
    const mobileRegex = /^[6-9]\d{9}$/;
    const landlineRegex = /^0\d{7,9}$/;

    if (!mobileRegex.test(cleanedPhone) && !landlineRegex.test(cleanedPhone)) {
      alert.error("Enter a valid 10-digit mobile number or a landline number starting with 0.");
      return;
    }

    dispatch(
      saveShippingInfo({
        address,
        city,
        phoneNo,
        email,
        fullName,
        deliveryType,
        deliveryFee
      })
    );
    history.push("/order/confirm");
  };


  return (
    <Box className={classes.shippingPage}>
      <MetaData title="Checkout - Delivery" />
      <Container maxWidth="lg">
        <CheckoutSteps activeStep={1} />

        <Grid container spacing={4} className={classes.mainContainer}>
          {/* Left Column - Shipping Form */}
          <Grid item xs={12} md={8}>
            <Paper className={classes.formPaper}>
              <Typography variant="h5" style={{ fontWeight: 800, marginBottom: "2rem" }}>
                Shipping Information
              </Typography>
              
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
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
                  <Grid item xs={12}>
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
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      variant="outlined"
                      value={phoneNo}
                      onChange={(e) => setPhone(e.target.value)}
                      className={classes.inputField}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Complete Address"
                      variant="outlined"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className={classes.inputField}
                      multiline
                      rows={3}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
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
                    <Typography variant="h6" style={{ fontWeight: 800, marginTop: "1rem", marginBottom: "1rem" }}>
                      Delivery Options
                    </Typography>
                    
                    <RadioGroup value={deliveryType} onChange={(e) => setDeliveryType(e.target.value)}>
                      <Box 
                        className={`${classes.deliveryOption} ${deliveryType === "home" ? classes.selectedDelivery : ""}`}
                        onClick={() => setDeliveryType("home")}
                      >
                        <FormControlLabel 
                          value="home" 
                          control={<Radio color="default" />} 
                          label={
                            <Box ml={1}>
                              <Typography style={{ fontWeight: 700 }}>Home Delivery</Typography>
                              <Typography variant="body2" color="textSecondary">Rs 170 • Delivered to your doorstep</Typography>
                            </Box>
                          } 
                        />
                      </Box>
                      <Box 
                        className={`${classes.deliveryOption} ${deliveryType === "pickup" ? classes.selectedDelivery : ""}`}
                        onClick={() => setDeliveryType("pickup")}
                      >
                        <FormControlLabel 
                          value="pickup" 
                          control={<Radio color="default" />} 
                          label={
                            <Box ml={1}>
                              <Typography style={{ fontWeight: 700 }}>Courier Pickup</Typography>
                              <Typography variant="body2" color="textSecondary">Rs 120 • Pick up from the nearest branch</Typography>
                            </Box>
                          } 
                        />
                      </Box>
                    </RadioGroup>
                  </Grid>

                  <Grid item xs={12}>

                    <Box display="flex" justifyContent="space-between" alignItems="center" mt={4} flexWrap="wrap" gap={2}>
                      <Button
                        className={classes.btnSecondary}
                        startIcon={<ArrowBackIosNewIcon style={{ fontSize: "14px" }} />}
                        onClick={() => history.push("/cart")}
                      >
                        Back to Cart
                      </Button>
                      <Button
                        type="submit"
                        className={classes.btnPrimary}
                        variant="contained"
                      >
                        Proceed to Checkout
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Grid>

          {/* Right Column - Order Summary */}
          <Grid item xs={12} md={4}>
            <Paper className={classes.summaryPaper}>
              <Typography className={classes.summaryTitle}>Order Summary</Typography>
              <Divider style={{ marginBottom: "1.5rem" }} />
              
              <Box className={classes.summaryItem}>
                <Typography color="textSecondary">Products ({cartItems.length})</Typography>
                <Typography style={{ fontWeight: 600 }}>{dispalyMoney(subtotal)}</Typography>
              </Box>
              <Box className={classes.summaryItem}>
                <Typography color="textSecondary">
                  Delivery Fee ({deliveryType === "home" ? "Home Delivery" : "Courier Pickup"})
                </Typography>
                <Typography style={{ fontWeight: 600 }}>{dispalyMoney(deliveryFee)}</Typography>
              </Box>

              
              <Divider style={{ margin: "1.5rem 0" }} />
              
              <Box className={classes.totalItem}>
                <Typography variant="h6" style={{ fontWeight: 800 }}>Total</Typography>
                <Typography variant="h6" style={{ fontWeight: 800 }}>{dispalyMoney(totalPrice)}</Typography>
              </Box>

              <Box mt={3}>
                <Typography variant="caption" color="textSecondary">
                  By continuing, you agree to Angels Attic's Terms of Use and Privacy Policy.
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Shipping;
