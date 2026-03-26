import React, { useState, useEffect } from "react";
import LockClockIcon from "@mui/icons-material/LockClock";
import { TextField, Button, Typography, Avatar } from "@material-ui/core";
import useStyles from "./LoginFromStyle";
import { useDispatch, useSelector } from "react-redux";
import { forgetPassword, clearErrors } from "../../actions/userAction";
import { useAlert } from "react-alert";
import MetaData from "../layouts/MataData/MataData";
import CricketBallLoader from "../layouts/loader/Loader";

import { Link, useHistory } from "react-router-dom";

export default function ForgotPassword() {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const alert = useAlert();
  const { error, message, loading } = useSelector(
    (state) => state.forgetPassword
  );

  const [email, setEmail] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(true);

  const handleEmailChange = (event) => {
    const newEmail = event.target.value;
    setEmail(newEmail);
    setIsValidEmail(
      newEmail !== "" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)
    );
  };

  function handleforgotPasswordSubmit(e) {
     e.preventDefault();
    
    if (email && isValidEmail) {
      dispatch(forgetPassword({ email }));
    }
  }

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (message) {
      alert.success(message);
      history.push({
        pathname: "/password/verify-otp",
        state: { email }
      });
    }
  }, [dispatch, error, alert, message, loading, history, email]);

  const isSignInDisabled = !(email && isValidEmail);

  return (
    <>
      <MetaData title="Forgot Password" />
      {loading ? (
        <CricketBallLoader />
      ) : (
        <div className={classes.formContainer}>
          <form className={classes.form} onSubmit={handleforgotPasswordSubmit}>
            <Avatar className={classes.avatar}>
              <LockClockIcon fontSize="large" stroke="#fff" strokeWidth={1} />
            </Avatar>
            <Typography variant="h4" component="h1" className={classes.heading} style={{ marginBottom: "1rem" }}>
              Forgot Password?
            </Typography>
            <Typography variant="body2" align="center" style={{ color: "#666", marginBottom: "2rem" }}>
              Enter your registered email address below and we'll send you a verification code (OTP) to reset your password.
            </Typography>

            <TextField
              label="Email Address"
              variant="outlined"
              fullWidth
              className={`${classes.emailInput} ${classes.textField}`}
              value={email}
              onChange={handleEmailChange}
              error={!isValidEmail && email !== ""}
              helperText={
                !isValidEmail && email !== ""
                  ? "Please enter a valid email address."
                  : ""
              }
              InputProps={{
                style: { borderRadius: "12px" }
              }}
            />

            <Button
              variant="contained"
              className={classes.loginButton}
              fullWidth
              disabled={isSignInDisabled || loading}
              style={{ padding: "14px", marginTop: "1rem", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}
              type="submit"
            >
              {loading ? "Sending..." : "Send Verification Code"}
            </Button>
            
            <div style={{ textAlign: "center", marginTop: "2rem" }}>
               <Link to="/login" className={classes.forgotPasswordLink} style={{ fontWeight: 600, fontSize: "0.95rem" }}>
                Back to Login
              </Link>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
