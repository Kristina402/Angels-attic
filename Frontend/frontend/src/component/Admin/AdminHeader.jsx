import React, { useState } from "react";
import { Box, Typography, IconButton, InputBase, Avatar, Badge, Menu, MenuItem, Divider } from "@mui/material";
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
  adminProfile: {
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
  adminAvatar: {
    width: "40px !important",
    height: "40px !important",
    borderRadius: "10px !important",
  },
  adminInfo: {
    display: "flex",
    flexDirection: "column",
  },
  adminName: {
    fontSize: "0.95rem !important",
    fontWeight: "700 !important",
    color: "#1a1a1a",
  },
  adminRole: {
    fontSize: "0.75rem !important",
    color: "#94a3b8",
    fontWeight: "600 !important",
  },
  menuItem: {
    padding: "10px 20px !important",
    fontSize: "0.9rem !important",
    fontWeight: "500 !important",
    gap: "10px !important",
    color: "#64748b !important",
    "&:hover": {
      backgroundColor: "#FDF2F8 !important",
      color: "#EC4899 !important",
      "& .MuiSvgIcon-root": {
        color: "#EC4899 !important",
      },
    },
  },
}));

const AdminHeader = ({ title }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const alert = useAlert();
  const history = useHistory();
  const { user } = useSelector((state) => state.userData);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    alert.success("Logged out successfully");
    handleClose();
  };

  const handleAccount = () => {
    history.push("/account");
    handleClose();
  };

  return (
    <Box className={classes.header}>
      <Box className={classes.leftSection}>
        <IconButton className={classes.iconButton}>
          <MenuIcon />
        </IconButton>
        <Typography className={classes.pageTitle}>{title || "Admin Dashboard"}</Typography>
        
        <Box className={classes.searchBar}>
          <SearchIcon style={{ color: "#94a3b8", fontSize: "20px" }} />
          <InputBase
            placeholder="Search products, orders, users..."
            className={classes.searchInput}
          />
        </Box>
      </Box>

      <Box className={classes.rightSection}>
        <IconButton className={classes.iconButton}>
          <Badge badgeContent={4} color="secondary" sx={{ "& .MuiBadge-badge": { backgroundColor: "#EC4899" } }}>
            <NotificationsNoneIcon />
          </Badge>
        </IconButton>

        <Box className={classes.adminProfile} onClick={handleProfileClick}>
          <Avatar 
            src={user && user.avatar && user.avatar.url} 
            alt={user && user.name}
            className={classes.adminAvatar}
          />
          <Box className={classes.adminInfo}>
            <Typography className={classes.adminName}>{user && user.name}</Typography>
            <Typography className={classes.adminRole}>Administrator</Typography>
          </Box>
          <KeyboardArrowDownIcon style={{ color: "#94a3b8", fontSize: "18px" }} />
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          PaperProps={{
            sx: {
              mt: 1.5,
              borderRadius: "15px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
              minWidth: "180px",
            }
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <MenuItem onClick={handleAccount} className={classes.menuItem}>
            <PersonOutlineIcon style={{ fontSize: "20px" }} /> Profile
          </MenuItem>
          <MenuItem onClick={handleClose} className={classes.menuItem}>
            <SettingsIcon style={{ fontSize: "20px" }} /> Settings
          </MenuItem>
          <Divider sx={{ my: 1 }} />
          <MenuItem onClick={handleLogout} className={classes.menuItem} style={{ color: "#ef4444" }}>
            <ExitToAppIcon style={{ fontSize: "20px" }} /> Logout
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default AdminHeader;
