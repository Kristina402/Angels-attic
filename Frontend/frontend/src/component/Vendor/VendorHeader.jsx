import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  InputBase,
  Avatar,
  Badge,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import SettingsIcon from "@mui/icons-material/Settings";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../actions/userAction";
import { useAlert } from "react-alert";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  header: {
    height: "80px",
    backgroundColor: "#FFFFFF",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 2rem",
    position: "fixed",
    top: 0,
    right: 0,
    left: "280px",
    zIndex: 1100,
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.01)",
    transition: "left 0.3s ease",
  },
  leftSection: {
    display: "flex",
    alignItems: "center",
    gap: "1.5rem",
  },
  pageTitle: {
    fontSize: "1.25rem !important",
    fontWeight: "700 !important",
    color: "#1a1a1a",
  },
  searchBar: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#F8F9FB",
    padding: "0.5rem 1rem",
    borderRadius: "30px",
    width: "400px",
    marginLeft: "2rem",
  },
  searchInput: {
    marginLeft: "0.5rem !important",
    flex: 1,
    fontSize: "0.9rem !important",
    color: "#4a5568",
  },
  rightSection: {
    display: "flex",
    alignItems: "center",
    gap: "1.5rem",
  },
  iconButton: {
    backgroundColor: "#F8F9FB !important",
    padding: "10px !important",
    color: "#64748b !important",
    "&:hover": {
      backgroundColor: "#FDF2F8 !important",
      color: "#EC4899 !important",
    },
  },
  vendorProfile: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "0.5rem 0.75rem",
    borderRadius: "12px",
    cursor: "pointer",
    transition: "background-color 0.2s",
    "&:hover": {
      backgroundColor: "#F8F9FB",
    },
  },
  vendorAvatar: {
    width: "40px !important",
    height: "40px !important",
    borderRadius: "10px !important",
    backgroundColor: "#EC4899 !important",
    color: "#fff !important",
    fontWeight: "700 !important",
  },
  vendorInfo: {
    display: "flex",
    flexDirection: "column",
  },
  vendorName: {
    fontSize: "0.95rem !important",
    fontWeight: "700 !important",
    color: "#1a1a1a",
  },
  vendorRole: {
    fontSize: "0.75rem !important",
    color: "#94a3b8",
    fontWeight: "600 !important",
  },
}));

const VendorHeader = ({ title }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const alert = useAlert();
  const history = useHistory();
  const { user } = useSelector((state) => state.userData);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const logoutHandler = () => {
    dispatch(logout());
    alert.success("Logged out successfully");
    handleClose();
  };

  const getInitials = (name) => {
    if (!name) return "V";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Box className={classes.header}>
      <Box className={classes.leftSection}>
        <IconButton size="small" className={classes.iconButton}>
          <MenuIcon />
        </IconButton>
        <Typography className={classes.pageTitle}>{title || "Dashboard"}</Typography>
        <Box className={classes.searchBar}>
          <SearchIcon sx={{ color: "#94a3b8", fontSize: "20px" }} />
          <InputBase placeholder="Search..." className={classes.searchInput} />
        </Box>
      </Box>

      <Box className={classes.rightSection}>
        <IconButton className={classes.iconButton}>
          <Badge variant="dot" color="error">
            <NotificationsNoneIcon />
          </Badge>
        </IconButton>

        <Box className={classes.vendorProfile} onClick={handleClick}>
          <Avatar className={classes.vendorAvatar}>
            {getInitials(user.name)}
          </Avatar>
          <Box className={classes.vendorInfo}>
            <Typography className={classes.vendorName}>{user.name}</Typography>
            <Typography className={classes.vendorRole}>Vendor</Typography>
          </Box>
          <KeyboardArrowDownIcon sx={{ color: "#94a3b8", fontSize: "20px" }} />
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              width: 200,
              mt: 1.5,
              borderRadius: "12px",
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
              border: "1px solid #f1f5f9",
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <MenuItem onClick={() => { handleClose(); history.push("/account"); }}>
            <PersonOutlineIcon sx={{ mr: 1.5, color: "#64748b" }} /> Profile
          </MenuItem>
          <MenuItem onClick={() => { handleClose(); history.push("/vendor/settings"); }}>
            <SettingsIcon sx={{ mr: 1.5, color: "#64748b" }} /> Settings
          </MenuItem>
          <Divider />
          <MenuItem onClick={logoutHandler} sx={{ color: "#ef4444" }}>
            <ExitToAppIcon sx={{ mr: 1.5, color: "#ef4444" }} /> Logout
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default VendorHeader;
