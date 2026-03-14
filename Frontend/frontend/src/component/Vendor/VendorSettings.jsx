import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import MetaData from "../layouts/MataData/MataData";
import Loader from "../layouts/loader/Loader";
import VendorSidebar from "./VendorSidebar";
import VendorHeader from "./VendorHeader";
import { updateProfile, updatePassword, clearErrors, load_UserProfile } from "../../actions/userAction";
import { UPDATE_PROFILE_RESET, UPDATE_PASSWORD_RESET } from "../../constants/userConstanat";
import { 
  Box, Typography, Grid, Paper, TextField, Button, Avatar, 
  Divider, Switch, FormControlLabel, IconButton 
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import LockIcon from "@mui/icons-material/Lock";
import PersonIcon from "@mui/icons-material/Person";
import StoreIcon from "@mui/icons-material/Store";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";

const useStyles = makeStyles((theme) => ({
  dashboard: {
    display: "flex",
    backgroundColor: "#F8F9FB",
    minHeight: "100vh",
  },
  mainContent: {
    flexGrow: 1,
    marginLeft: "280px",
    marginTop: "80px",
    padding: "2rem",
  },
  sectionPaper: {
    padding: "2rem",
    borderRadius: "16px !important",
    border: "none !important",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.01) !important",
    marginBottom: "2rem",
  },
  sectionTitle: {
    fontSize: "1.25rem !important",
    fontWeight: "800 !important",
    color: "#1a1a1a",
    marginBottom: "1.5rem !important",
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
  },
  avatarContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1rem",
    marginBottom: "2rem",
  },
  largeAvatar: {
    width: "120px !important",
    height: "120px !important",
    borderRadius: "24px !important",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
  },
  saveBtn: {
    backgroundColor: "#EC4899 !important",
    color: "#FFFFFF !important",
    padding: "10px 32px !important",
    borderRadius: "12px !important",
    textTransform: "none !important",
    fontWeight: "600 !important",
    marginTop: "1rem !important",
    "&:hover": {
      backgroundColor: "#DB2777 !important",
    },
  },
  uploadBtn: {
    borderRadius: "10px !important",
    textTransform: "none !important",
    fontWeight: "600 !important",
    color: "#64748b !important",
    borderColor: "#e2e8f0 !important",
  },
}));

const VendorSettings = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const alert = useAlert();

  const { user } = useSelector((state) => state.userData);
  const { error, isUpdated, loading } = useSelector((state) => state.profileData);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [storeName, setStoreName] = useState("");
  const [storeDescription, setStoreDescription] = useState("");
  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("/Profile.png");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setStoreName(user.storeName || "");
      setStoreDescription(user.storeDescription || "");
      setAvatarPreview(user.avatar?.url || "/Profile.png");
    }

    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      alert.success("Profile updated successfully");
      dispatch(load_UserProfile());
      dispatch({ type: UPDATE_PROFILE_RESET });
      dispatch({ type: UPDATE_PASSWORD_RESET });
      
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  }, [dispatch, alert, error, user, isUpdated]);

  const updateProfileSubmit = (e) => {
    e.preventDefault();
    const myForm = new FormData();
    myForm.set("name", name);
    myForm.set("email", email);
    myForm.set("phone", phone);
    myForm.set("storeName", storeName);
    myForm.set("storeDescription", storeDescription);
    if (avatar) {
      myForm.set("avatar", avatar);
    }
    dispatch(updateProfile(myForm));
  };

  const updatePasswordSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert.error("Passwords do not match");
      return;
    }
    const myForm = {
      oldPassword,
      newPassword,
      confirmPassword,
    };
    dispatch(updatePassword(myForm));
  };

  const updateAvatarDataChange = (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatarPreview(reader.result);
        setAvatar(reader.result);
      }
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  return (
    <Box className={classes.dashboard}>
      <MetaData title="Vendor Settings - Angels Attic" />
      <VendorSidebar />
      <Box className={classes.mainContent}>
        <VendorHeader title="Account Settings" />

        {loading ? (
          <Loader />
        ) : (
          <Grid container spacing={3} sx={{ mt: 2 }}>
            {/* Profile & Store Settings */}
            <Grid item xs={12} md={7}>
              <Paper className={classes.sectionPaper}>
                <Typography className={classes.sectionTitle}>
                  <PersonIcon sx={{ color: "#EC4899" }} /> Profile & Store Details
                </Typography>
                
                <Box className={classes.avatarContainer}>
                  <Avatar src={avatarPreview} className={classes.largeAvatar} />
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="avatar-upload"
                    type="file"
                    onChange={updateAvatarDataChange}
                  />
                  <label htmlFor="avatar-upload">
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={<PhotoCameraIcon />}
                      className={classes.uploadBtn}
                    >
                      Change Profile Photo
                    </Button>
                  </label>
                </Box>

                <form onSubmit={updateProfileSubmit}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Phone Number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        variant="outlined"
                        InputProps={{
                          startAdornment: <LocalPhoneIcon sx={{ color: "#94a3b8", mr: 1 }} />,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Store Name"
                        value={storeName}
                        onChange={(e) => setStoreName(e.target.value)}
                        variant="outlined"
                        InputProps={{
                          startAdornment: <StoreIcon sx={{ color: "#94a3b8", mr: 1 }} />,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Store Description"
                        multiline
                        rows={4}
                        value={storeDescription}
                        onChange={(e) => setStoreDescription(e.target.value)}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button type="submit" className={classes.saveBtn}>
                        Save Profile Changes
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </Paper>
            </Grid>

            {/* Password Settings */}
            <Grid item xs={12} md={5}>
              <Paper className={classes.sectionPaper}>
                <Typography className={classes.sectionTitle}>
                  <LockIcon sx={{ color: "#F59E0B" }} /> Change Password
                </Typography>
                
                <form onSubmit={updatePasswordSubmit}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        type="password"
                        label="Current Password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        type="password"
                        label="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        type="password"
                        label="Confirm New Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button type="submit" className={classes.saveBtn} fullWidth>
                        Update Password
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </Paper>

              <Paper className={classes.sectionPaper} sx={{ bgcolor: "#FDF2F8 !important" }}>
                <Typography sx={{ fontWeight: 700, color: "#EC4899", mb: 1 }}>Account Security</Typography>
                <Typography variant="body2" sx={{ color: "#DB2777" }}>
                  Ensure your password is at least 8 characters long and includes a mix of letters, numbers, and symbols.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default VendorSettings;
