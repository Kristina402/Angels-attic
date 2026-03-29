import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import MetaData from "../layouts/MataData/MataData";
import { registerVendor, clearErrors } from "../../actions/userAction";
import { useHistory } from "react-router-dom";
import {
  Avatar,
  TextField,
  Typography,
  Button,
  Grid,
  Paper,
  Box,
} from "@material-ui/core";
import StorefrontIcon from "@mui/icons-material/Storefront";
import useStyles from "./LoginFromStyle";

const VendorRegistration = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const history = useHistory();
  const classes = useStyles();

  const { error, loading, success, message } = useSelector(
    (state) => state.vendor
  );

  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    storeName: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const [isValidPassword, setIsValidPassword] = useState(true);

  const { name, email, phone, storeName, address, password, confirmPassword } = user;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
    if (name === "password") {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%])[A-Za-z\d!@#$%]{8,}$/;
      setIsValidPassword(passwordRegex.test(value));
    }
  };



  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isValidPassword) {
      alert.error("Password must be at least 8 characters and include uppercase, lowercase, number, and symbol.");
      return;
    }

    if (password !== confirmPassword) {
      alert.error("Passwords do not match.");
      return;
    }

    const mobileRegex = /^[6-9]\d{9}$/;
    const landlineRegex = /^0\d{7,9}$/;

    if (!mobileRegex.test(phone) && !landlineRegex.test(phone)) {
      alert.error("Enter a valid mobile or landline number.");
      return;
    }

    const vendorData = {
      ...user,
    };

    dispatch(registerVendor(vendorData));
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (success) {
      alert.success("Vendor registration successful! Welcome to Angels Attic.");
      history.push("/vendor/dashboard");
    }
  }, [dispatch, error, alert, success, message, history]);

  return (
    <>
      <MetaData title="Become a Vendor – Angels Attic" />
      <div className={classes.formContainer} style={{ minHeight: "100vh", backgroundColor: "#fdfdfd" }}>
        <Grid container justifyContent="center" alignItems="center">
          <Grid item xs={11} sm={8} md={6} lg={5}>
            <Paper elevation={0} style={{ padding: "3rem", borderRadius: "20px", border: "1px solid #eee" }}>
              <Box textAlign="center" mb={4}>
                <Avatar style={{ backgroundColor: "#000", margin: "0 auto 1rem", width: "60px", height: "60px" }}>
                  <StorefrontIcon style={{ fontSize: "30px" }} />
                </Avatar>
                <Typography variant="h4" style={{ fontWeight: 800, color: "#1a1a1a", letterSpacing: "-0.5px" }}>
                  Become a Vendor – Angels Attic
                </Typography>
                <Typography variant="body1" color="textSecondary" style={{ marginTop: "1rem", maxWidth: "400px", margin: "1rem auto 0" }}>
                  Start your journey as a sustainable seller. List and sell your unique thrifted items to our community.
                </Typography>
              </Box>

              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      name="name"
                      value={name}
                      onChange={handleInputChange}
                      required
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      name="email"
                      type="email"
                      value={email}
                      onChange={handleInputChange}
                      required
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      name="phone"
                      value={phone}
                      onChange={handleInputChange}
                      required
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Store Name"
                      name="storeName"
                      value={storeName}
                      onChange={handleInputChange}
                      required
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Address"
                      name="address"
                      value={address}
                      onChange={handleInputChange}
                      required
                      variant="outlined"
                      multiline
                      rows={2}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Password"
                      name="password"
                      type="password"
                      value={password}
                      onChange={handleInputChange}
                      required
                      variant="outlined"
                      error={!isValidPassword && password !== ""}
                      helperText={
                        !isValidPassword && password !== ""
                          ? "Password must be at least 8 characters and include uppercase, lowercase, number, and symbol."
                          : ""
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Confirm Password"
                      name="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={handleInputChange}
                      required
                      variant="outlined"
                    />
                  </Grid>



                  <Grid item xs={12}>
                    <Button
                      fullWidth
                      type="submit"
                      variant="contained"
                      disabled={loading}
                      style={{
                        backgroundColor: "#000",
                        color: "#fff",
                        padding: "1rem",
                        marginTop: "1.5rem",
                        borderRadius: "12px",
                        fontWeight: 700,
                        fontSize: "1rem",
                        textTransform: "none",
                        boxShadow: "0 10px 20px rgba(0,0,0,0.1)"
                      }}
                    >
                      {loading ? "Processing..." : "Register Vendor"}
                    </Button>
                  </Grid>
                </Grid>
              </form>

              <Box mt={4} textAlign="center">
                <Typography variant="body2" color="textSecondary" style={{ fontStyle: "italic" }}>
                  Note: By registering as a vendor, you agree to our terms and conditions for sustainable selling.
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default VendorRegistration;
