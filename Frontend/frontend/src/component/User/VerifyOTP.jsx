import React, { useState, useEffect } from "react";
import useStyles from "./LoginFromStyle";
import { TextField, Button, Typography, Avatar } from "@material-ui/core";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import { useDispatch, useSelector } from "react-redux";
import { verifyOTP, clearErrors } from "../../actions/userAction";
import { useAlert } from "react-alert";
import MetaData from "../layouts/MataData/MataData";
import { useHistory, useLocation } from "react-router-dom";
import CricketBallLoader from "../layouts/loader/Loader";

const VerifyOTP = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const alert = useAlert();
  const history = useHistory();
  const location = useLocation();

  const [otp, setOtp] = useState("");
  const email = location.state?.email;

  const { error, loading, otpVerified, message } = useSelector(
    (state) => state.forgetPassword
  );

  useEffect(() => {
    if (!email) {
      history.push("/password/forgot");
    }

    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (otpVerified) {
      alert.success(message);
      history.push({
        pathname: "/password/reset",
        state: { email, otp }
      });
    }
  }, [dispatch, error, alert, otpVerified, message, history, email, otp]);

  const handleVerifySubmit = (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      alert.error("Please enter a 6-digit OTP");
      return;
    }
    dispatch(verifyOTP(email, otp));
  };

  return (
    <>
      <MetaData title="Verify OTP" />
      {loading ? (
        <CricketBallLoader />
      ) : (
        <div className={classes.formContainer}>
          <form className={classes.form} onSubmit={handleVerifySubmit}>
            <Avatar className={classes.avatar}>
              <VerifiedUserIcon fontSize="large" stroke="#fff" strokeWidth={1} />
            </Avatar>
            <Typography variant="h4" component="h1" className={classes.heading} style={{ marginBottom: "1rem" }}>
              Verify OTP
            </Typography>
            <Typography variant="body2" align="center" style={{ color: "#666", marginBottom: "2rem" }}>
              We've sent a 6-digit verification code to <strong>{email}</strong>. Please enter it below to continue.
            </Typography>

            <TextField
              label="6-Digit OTP"
              variant="outlined"
              fullWidth
              className={classes.textField}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              inputProps={{ maxLength: 6, style: { textAlign: 'center', letterSpacing: '8px', fontSize: '1.5rem', fontWeight: 'bold' } }}
              InputProps={{
                style: { borderRadius: "12px" }
              }}
            />

            <Button
              variant="contained"
              className={classes.loginButton}
              fullWidth
              disabled={otp.length !== 6 || loading}
              style={{ padding: "14px", marginTop: "2rem", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}
              type="submit"
            >
              Verify Code
            </Button>
            
            <div style={{ textAlign: "center", marginTop: "2rem" }}>
              <Typography variant="body2" style={{ color: "#666" }}>
                Didn't receive the code? {" "}
                <span 
                  onClick={() => history.push("/password/forgot")} 
                  style={{ color: "#1a1a1a", fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Resend Email
                </span>
              </Typography>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default VerifyOTP;
