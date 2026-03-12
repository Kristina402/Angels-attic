import React, { useState, useEffect } from "react";
import {
  Avatar,
  Button,
  Checkbox,
  TextField,
  FormControlLabel,
  Grid,
  Typography,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
} from "@material-ui/core";
import CricketBallLoader from "../layouts/loader/Loader";
import MetaData from "../layouts/MataData/MataData";
import { Link, useHistory } from "react-router-dom";
import { signUp, clearErrors } from "../../actions/userAction";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import useStyles from "./LoginFromStyle";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";

function Signup() {
  const classes = useStyles();
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [role, setRole] = useState("customer");
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isValidName, setIsValidName] = useState(true);
  const [isValidPassword, setIsValidPassword] = useState(true);
  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");
  const [loading, setLoading] = useState(false);

  const [areCheckboxesChecked, setAreCheckboxesChecked] = useState({
    checkbox1: false,
    checkbox2: false,
  });
  const history = useHistory();

  const dispatch = useDispatch();
  const alert = useAlert();

  const { isAuthenticated, error, user } = useSelector((state) => state.userData);

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (isAuthenticated) {
      alert.success("User Registered Successfully");
      if (user && user.role === "vendor") {
        history.push("/vendor/dashboard");
      } else {
        history.push("/account");
      }
    }
  }, [dispatch, isAuthenticated, loading, error, alert , history, user]);

  const handleRoleChange = (event) => {
    setRole(event.target.value);
    if (event.target.value === "vendor") {
      history.push("/vendor/register");
    }
  };

  const handleEmailChange = (event) => {
    const newEmail = event.target.value;
    setEmail(newEmail);
    setIsValidEmail(
      newEmail !== "" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)
    );
  };

  const handleAvatarChange = (event) => {

    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setAvatarPreview(reader.result);
        setAvatar(reader.result);
    
      };
    }
  };

  const handleNameChange = (event) => {
    const newName = event.target.value;
    setName(newName);
    setIsValidName(newName.length >= 4 && newName.length <= 20);
  };
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

  const handleCheckboxChange = (checkboxName) => (event) => {
    setAreCheckboxesChecked((prevState) => ({
      ...prevState,
      [checkboxName]: event.target.checked,
    }));
  };

  let isSignInDisabled = !(
    email &&
    password &&
    isValidEmail &&
    confirmPassword &&
    name &&
    isValidName &&
    areCheckboxesChecked.checkbox1 &&
    areCheckboxesChecked.checkbox2
  );

  function handleSignUpSubmit(e) {
      setLoading(true);
    e.preventDefault();
  

    if (password !== confirmPassword) {
      alert.error("Password and Confirm Password do not match");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.set("name", name);
    formData.set("email", email);
    formData.set("password", password);
    formData.set("avatar", avatar);

    dispatch(signUp(formData));
    setLoading(false);
  }

  return (
    <>
      <MetaData title={"Sign Up"} />
      {loading ? (
        <CricketBallLoader />
      ) : (
        <div className={classes.formContainer}>
          <form className={classes.form} onSubmit={handleSignUpSubmit}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography variant="h5" component="h1" className={classes.heading}>
              Sign Up for an Account ! 
            </Typography>

            <FormControl component="fieldset" style={{ marginBottom: "1rem" }}>
              <FormLabel component="legend" style={{ color: "#1a1a1a", fontWeight: 600, fontSize: "0.9rem" }}>Register as:</FormLabel>
              <RadioGroup row name="role" value={role} onChange={handleRoleChange}>
                <FormControlLabel 
                  value="customer" 
                  control={<Radio color="primary" />} 
                  label={<Typography style={{ fontSize: "0.9rem", fontWeight: 500 }}>Customer</Typography>} 
                />
                <FormControlLabel 
                  value="vendor" 
                  control={<Radio color="primary" />} 
                  label={<Typography style={{ fontSize: "0.9rem", fontWeight: 500 }}>Vendor</Typography>} 
                />
              </RadioGroup>
            </FormControl>

            <TextField
              label="Name"
              variant="outlined"
              fullWidth
              className={`${classes.nameInput} ${classes.textField}`}
              value={name}
              onChange={handleNameChange}
              error={!isValidName && name !== ""}
              helperText={
                !isValidName && name !== "" ? "Name must be between 4 and 20 characters." : ""
              }
            />

            <TextField
              label="Email"
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
            />
            <TextField
              label="Password"
              variant="outlined"
              type={showPassword ? "text" : "password"}
              fullWidth
              className={`${classes.passwordInput} ${classes.textField}`}
              error={!isValidPassword && password !== ""}
               helperText={ !isValidPassword && password !== "" ? "Password must be at least 8 characters." : ""}
              InputProps={{
                endAdornment: (
                  <Button
                    variant="outlined"
                    className={classes.showPasswordButton}
                    onClick={handleShowPasswordClick}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </Button>
                ),
              }}
              value={password}
              onChange={handlePasswordChange}
            />
            <TextField
              label="Confirm Password"
              variant="outlined"
              type={showPassword ? "text" : "password"}
              fullWidth
              className={`${classes.passwordInput} ${classes.textField}`}
              InputProps={{
                endAdornment: (
                  <Button
                    variant="outlined"
                    className={classes.showPasswordButton}
                    onClick={handleShowPasswordClick}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </Button>
                ),
              }}
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
            />

            <div className={classes.avatarContainer}>
              <Avatar
                src={avatarPreview}
                alt="Avatar Preview"
                className={classes.avatarPreview}
              />
              <input
                accept="image/*"
                className={classes.avatarInput}
                id="avatar-input"
                type="file"
                onChange={handleAvatarChange}
              />
              <label htmlFor="avatar-input">
                <Button
                  variant="contained"
                  color="default"
                  startIcon={<CloudUploadIcon />}
                  component="span"
                  className={classes.uploadButton}
                >
                  Upload Avatar
                </Button>
              </label>
            </div>

            <Grid container className={classes.rememberMeContainer}>
              <Grid item>
                <FormControlLabel
                  control={
                    <Checkbox
                      color="primary"
                      checked={areCheckboxesChecked.checkbox1}
                      onChange={handleCheckboxChange("checkbox1")}
                    />
                  }
                  label="I accept the Terms of Use"
                />
              </Grid>
              <Grid item>
                <FormControlLabel
                  control={
                    <Checkbox
                      color="primary"
                      checked={areCheckboxesChecked.checkbox2}
                      onChange={handleCheckboxChange("checkbox2")}
                    />
                  }
                  label="I acknowledge the Privacy Policy"
                />
              </Grid>
            </Grid>

            <Button
              variant="contained"
              className={classes.loginButton}
              fullWidth
              disabled={isSignInDisabled}
              type="submit"
            >
              Sign Up
            </Button>

            <Typography
              variant="body1"
              align="center"
              style={{ marginTop: "1rem" }}
            >
              Already have an account?
              <Link to="/login" className={classes.createAccount}>
                Login
              </Link>
            </Typography>
          </form>
        </div>
      )}
    </>
  );
}

export default Signup;
