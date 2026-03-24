import React, { useState, useEffect } from "react";
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
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import SettingsIcon from "@mui/icons-material/Settings";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import MessageOutlinedIcon from "@mui/icons-material/MessageOutlined";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../actions/userAction";
import { getNotifications, markNotificationAsRead, clearErrors } from "../../actions/notificationAction";
import { useAlert } from "react-alert";
import { useHistory } from "react-router-dom";
import { MARK_AS_READ_RESET } from "../../constants/notificationConstants";

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
  notificationMenu: {
    "& .MuiPaper-root": {
      width: "360px",
      maxHeight: "480px",
      borderRadius: "16px",
      mt: 1.5,
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      border: "1px solid #f1f5f9",
    }
  },
  notificationHeader: {
    padding: "1rem 1.25rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: "1px solid #f1f5f9",
  },
  notificationItem: {
    padding: "1rem 1.25rem !important",
    borderBottom: "1px solid #f8fafc",
    cursor: "pointer",
    transition: "background-color 0.2s",
    "&:hover": {
      backgroundColor: "#f8fafc",
    },
    "&.unread": {
      backgroundColor: "#fdf2f8",
      "&:hover": {
        backgroundColor: "#fce7f3",
      },
    }
  },
  notificationIcon: {
    width: "40px",
    height: "40px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  orderIcon: { backgroundColor: "#dcfce7", color: "#22c55e" },
  approvalIcon: { backgroundColor: "#dbeafe", color: "#3b82f6" },
  messageIcon: { backgroundColor: "#fef3c7", color: "#f59e0b" },
  emptyNotifications: {
    padding: "3rem 2rem",
    textAlign: "center",
    color: "#94a3b8",
  }
}));

const VendorHeader = ({ title }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const alert = useAlert();
  const history = useHistory();
  const { user } = useSelector((state) => state.userData);
  const { notifications, error, isUpdated } = useSelector((state) => state.notifications);

  const [anchorEl, setAnchorEl] = useState(null);
  const [notifAnchorEl, setNotifAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const notifOpen = Boolean(notifAnchorEl);

  useEffect(() => {
    dispatch(getNotifications());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (isUpdated) {
      dispatch(getNotifications());
      dispatch({ type: MARK_AS_READ_RESET });
    }
  }, [dispatch, error, alert, isUpdated]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotifClick = (event) => {
    setNotifAnchorEl(event.currentTarget);
  };

  const handleNotifClose = () => {
    setNotifAnchorEl(null);
  };

  const handleNotifItemClick = (notification) => {
    if (!notification.read) {
      dispatch(markNotificationAsRead(notification._id));
    }
    handleNotifClose();
    if (notification.link) {
      history.push(notification.link);
    }
  };

  const logoutHandler = async () => {
    const success = await dispatch(logout());
    if (success) {
      alert.success("Logged out successfully");
      handleClose();
      history.push("/login");
    }
  };

  const getInitials = (name) => {
    if (!name) return "V";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const unreadCount = notifications ? notifications.filter(n => !n.read).length : 0;

  const getNotificationIcon = (type) => {
    switch (type) {
      case "new_order":
        return <ShoppingBagOutlinedIcon fontSize="small" />;
      case "product_approval":
      case "vendor_approval":
        return <CheckCircleOutlineIcon fontSize="small" />;
      case "customer_message":
        return <MessageOutlinedIcon fontSize="small" />;
      default:
        return <NotificationsNoneIcon fontSize="small" />;
    }
  };

  const getIconClass = (type) => {
    switch (type) {
      case "new_order":
        return classes.orderIcon;
      case "product_approval":
      case "vendor_approval":
        return classes.approvalIcon;
      case "customer_message":
        return classes.messageIcon;
      default:
        return classes.approvalIcon;
    }
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
        <IconButton className={classes.iconButton} onClick={handleNotifClick}>
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsNoneIcon />
          </Badge>
        </IconButton>

        <Menu
          anchorEl={notifAnchorEl}
          open={notifOpen}
          onClose={handleNotifClose}
          className={classes.notificationMenu}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <Box className={classes.notificationHeader}>
            <Typography sx={{ fontWeight: 800, color: "#1a1a1a" }}>Notifications</Typography>
            {unreadCount > 0 && (
              <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: "#EC4899", cursor: "pointer" }}>
                {unreadCount} New
              </Typography>
            )}
          </Box>
          <List sx={{ p: 0, maxHeight: "400px", overflowY: "auto" }}>
            {notifications && notifications.length > 0 ? (
              notifications.map((notif) => (
                <ListItem 
                  key={notif._id} 
                  className={`${classes.notificationItem} ${!notif.read ? "unread" : ""}`}
                  onClick={() => handleNotifItemClick(notif)}
                >
                  <ListItemAvatar>
                    <Box className={`${classes.notificationIcon} ${getIconClass(notif.type)}`}>
                      {getNotificationIcon(notif.type)}
                    </Box>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography sx={{ fontSize: "0.875rem", fontWeight: notif.read ? 500 : 700, color: "#1e293b" }}>
                        {notif.message}
                      </Typography>
                    }
                    secondary={
                      <Typography sx={{ fontSize: "0.75rem", color: "#94a3b8", mt: 0.5 }}>
                        {new Date(notif.createdAt).toLocaleDateString()} at {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Typography>
                    }
                  />
                </ListItem>
              ))
            ) : (
              <Box className={classes.emptyNotifications}>
                <NotificationsNoneIcon sx={{ fontSize: 48, color: "#e2e8f0", mb: 2 }} />
                <Typography sx={{ color: "#94a3b8", fontSize: "0.875rem" }}>No notifications yet</Typography>
              </Box>
            )}
          </List>
        </Menu>

        <Box className={classes.vendorProfile} onClick={handleClick}>
          <Avatar className={classes.vendorAvatar} src={user.avatar?.url}>
            {!user.avatar?.url && getInitials(user.name)}
          </Avatar>
          <Box className={classes.vendorInfo}>
            <Typography className={classes.vendorName}>{user.name}</Typography>
            <Typography className={classes.vendorRole}>{user.storeName || "Vendor"}</Typography>
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
          <MenuItem onClick={() => { handleClose(); history.push("/vendor/settings"); }}>
            <PersonOutlineIcon sx={{ mr: 1.5, color: "#64748b" }} /> Profile
          </MenuItem>
          <MenuItem onClick={() => { handleClose(); history.push("/vendor/settings"); }}>
            <SettingsIcon sx={{ mr: 1.5, color: "#64748b" }} /> Settings
          </MenuItem>
          <Divider sx={{ my: 1 }} />
          <MenuItem onClick={logoutHandler} sx={{ color: "#ef4444" }}>
            <ExitToAppIcon sx={{ mr: 1.5 }} /> Logout
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default VendorHeader;
