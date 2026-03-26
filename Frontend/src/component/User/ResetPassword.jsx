import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword, clearErrors } from "../../actions/userAction";
import { useAlert } from "react-alert";
import MetaData from "../layouts/MataData/MataData";
import { useHistory, useLocation } from "react-router-dom";
import CricketBallLoader from "../layouts/loader/Loader";
import { Avatar, Button, TextField, Typography } from "@material-ui/core";
import LockResetIcon from "@mui/icons-material/LockReset";
import useStyles from "./LoginFromStyle";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Link } from "react-router-dom";


function ResetPassword() {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const alert = useAlert();

  const { error, success, loading } = useSelector(
    (state) => state.forgetPassword
  );

  const classes = useStyles();
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [isValidPassword, setIsValidPassword] = useState(true);

  const email = location.state?.email;
  const otp = location.state?.otp;

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setIsValidPassword(event.target.value.length >= 8);
  };
  const handleConfirmPasswordChange = (event) => {
    setconfirmPassword(event.target.value);
  };

  const handleShowPasswordClick = () => {
    setShowPassword(!showPassword);
  };
  
  useEffect(() => {
    if (!email || !otp) {
      history.push("/password/forgot");
    }

    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (success) {
      alert.success("Password Updated Successfully");
      history.push("/login");
    }
  }, [dispatch, error, alert, success, history, email, otp]);


   // submit handler
  function resetPasswordSubmitHandler(e) {
    e.preventDefault();

   if (password !== confirmPassword) {
     alert.error("Password and Confirm Password do not match");
     return;
   }
   
   dispatch(resetPassword({ email, otp, password, confirmPassword }));
  }

  const isSignInDisabled = !(password && confirmPassword && isValidPassword) ;

  return (
    <>
      <MetaData title="Reset Password" />
      {loading ? (
        <CricketBallLoader />
      ) : (
        <div className={classes.formContainer}>
          <form className={classes.form} onSubmit={resetPasswordSubmitHandler}>
            <Avatar className={classes.avatar}>
              <LockResetIcon fontSize="large" stroke="#fff" strokeWidth={1} />
            </Avatar>
            <Typography variant="h4" component="h1" className={classes.heading} style={{ marginBottom: "1rem" }}>
              Reset Password
            </Typography>
            <Typography variant="body2" align="center" style={{ color: "#666", marginBottom: "2rem" }}>
              Please enter your new password below to regain access to your account.
            </Typography>

            <TextField
              style={{ marginTop: "1rem" }}
              label="New Password"
              variant="outlined"
              type={showPassword ? "text" : "password"}
              fullWidth
              className={`${classes.passwordInput} ${classes.textField}`}
              error={!isValidPassword && password !== ""}
              helperText={
                !isValidPassword && password !== ""
                  ? "Password must be at least 8 characters."
                  : ""
              }
              InputProps={{
                style: { borderRadius: "12px" },
                endAdornment: (
                  <Button
                    variant="text"
                    className={classes.showPasswordButton}
                    onClick={handleShowPasswordClick}
                    style={{ minWidth: "auto", padding: "8px" }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </Button>
                ),
              }}
              value={password}
              onChange={handlePasswordChange}
            />
            <TextField 
              label="Confirm New Password"
              variant="outlined"
              type={showPassword ? "text" : "password"}
              fullWidth
              className={`${classes.passwordInput} ${classes.textField}`}
              InputProps={{
                style: { borderRadius: "12px" },
                endAdornment: (
                  <Button
                    variant="text"
                    className={classes.showPasswordButton}
                    onClick={handleShowPasswordClick}
                    style={{ minWidth: "auto", padding: "8px" }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </Button>
                ),
              }}
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
            />

            <Button
              variant="contained"
              className={classes.loginButton}
              fullWidth
              disabled={isSignInDisabled || loading}
              style={{ padding: "14px", marginTop: "2rem", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}
              type="submit"
            >
              {loading ? "Updating..." : "Update Password"}
            </Button>
            
            <div style={{ textAlign: "center", marginTop: "2rem" }}>
               <Link to="/login" className={classes.forgotPasswordLink} style={{ fontWeight: 600, fontSize: "0.95rem" }}>
                Cancel & Return
              </Link>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

export default ResetPassword;
