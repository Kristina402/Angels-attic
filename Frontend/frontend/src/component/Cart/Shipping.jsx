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
import { dispalyMoney } from "../DisplayMoney/DisplayMoney";

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
}));

const Shipping = () => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const history = useHistory();
  const { shippingInfo, cartItems } = useSelector((state) => state.cart);

  const classes = useStyles();
  const [address, setAddress] = React.useState(shippingInfo.address || "");
  const [firstName, setFirstName] = React.useState(shippingInfo.firstName || "");
  const [lastName, setLastName] = React.useState(shippingInfo.lastName || "");
  const [city, setCity] = React.useState(shippingInfo.city || "");
  const [pinCode, setPinCode] = React.useState(shippingInfo.pinCode || "");
  const [state, setState] = React.useState(shippingInfo.state || "");
  const [phoneNo, setPhone] = React.useState(shippingInfo.phoneNo || "");
  const [email, setEmail] = React.useState(shippingInfo.email || "");
  const [saveAddress, setSaveAddress] = React.useState(false);
  const [sameBillingDelivery, setSameBillingDelivery] = React.useState(true);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = subtotal > 5000 ? 0 : 200;
  const totalPrice = subtotal + deliveryFee;

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!email || !firstName || !lastName || !address || !city || !state || !pinCode || !phoneNo) {
      alert.error("Please fill all the fields");
      return;
    }

    if (phoneNo.length !== 10) {
      alert.error("Phone Number should be 10 digits");
      return;
    }

    dispatch(
      saveShippingInfo({
        address,
        city,
        state,
        pinCode,
        phoneNo,
        email,
        firstName,
        lastName,
        country: "India" // Set default since it was removed from form
      })
    );
    history.push("/confirm/order");
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
                Shipping Address
              </Typography>
              
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="First Name"
                      variant="outlined"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className={classes.inputField}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      variant="outlined"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className={classes.inputField}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Address"
                      variant="outlined"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className={classes.inputField}
                      multiline
                      rows={2}
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
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="State"
                      variant="outlined"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className={classes.inputField}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Pincode"
                      variant="outlined"
                      value={pinCode}
                      onChange={(e) => setPinCode(e.target.value)}
                      className={classes.inputField}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      variant="outlined"
                      value={phoneNo}
                      onChange={(e) => setPhone(e.target.value)}
                      className={classes.inputField}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email"
                      variant="outlined"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={classes.inputField}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Box mt={1}>
                      <FormControlLabel
                        control={<Checkbox checked={saveAddress} onChange={(e) => setSaveAddress(e.target.checked)} color="default" />}
                        label={<Typography variant="body2">Save address to address book</Typography>}
                      />
                      <Box>
                        <FormControlLabel
                          control={<Checkbox checked={sameBillingDelivery} onChange={(e) => setSameBillingDelivery(e.target.checked)} color="default" />}
                          label={<Typography variant="body2">My billing and delivery information are the same</Typography>}
                        />
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mt={4} flexWrap="wrap" gap={2}>
                      <Button
                        className={classes.btnSecondary}
                        startIcon={<ArrowBackIosNewIcon style={{ fontSize: "14px" }} />}
                        onClick={() => history.push("/cart")}
                      >
                        Back to Bag
                      </Button>
                      <Button
                        type="submit"
                        className={classes.btnPrimary}
                        variant="contained"
                      >
                        Continue to Payment
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
                <Typography color="textSecondary">Delivery fee</Typography>
                <Typography style={{ fontWeight: 600 }}>{deliveryFee === 0 ? "FREE" : dispalyMoney(deliveryFee)}</Typography>
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
