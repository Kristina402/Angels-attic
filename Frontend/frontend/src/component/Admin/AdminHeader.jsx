import React, { useState, useEffect } from "react";
import { Box, Typography, IconButton, InputBase, Avatar, Badge, Menu, MenuItem, Divider, Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import SettingsIcon from "@mui/icons-material/Settings";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import StorefrontIcon from "@mui/icons-material/Storefront";
import PaymentIcon from "@mui/icons-material/Payment";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../actions/userAction";
import { getNotifications, markNotificationAsRead, clearAllNotifications, markAllNotificationsRead } from "../../actions/notificationAction";
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
  notificationMenu: {
    width: "360px",
    maxHeight: "480px",
    overflow: "hidden",
    borderRadius: "20px !important",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important",
    padding: "0 !important",
  },
  notificationHeader: {
    padding: "1.25rem 1.5rem",
    borderBottom: "1px solid #f1f5f9",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  notificationTitle: {
    fontSize: "1.1rem !important",
    fontWeight: "700 !important",
    color: "#1e293b",
  },
  clearAllBtn: {
    fontSize: "0.75rem !important",
    textTransform: "none !important",
    color: "#EC4899 !important",
    fontWeight: "600 !important",
    "&:hover": {
      backgroundColor: "#FDF2F8 !important",
    },
  },
  notificationList: {
    maxHeight: "360px",
    overflowY: "auto",
    "&::-webkit-scrollbar": {
      width: "6px",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#e2e8f0",
      borderRadius: "10px",
    },
  },
  notificationItem: {
    padding: "1rem 1.5rem !important",
    borderBottom: "1px solid #f8fafc !important",
    display: "flex !important",
    gap: "1rem !important",
    transition: "background-color 0.2s !important",
    "&:hover": {
      backgroundColor: "#f8fafc !important",
    },
    whiteSpace: "normal !important",
  },
  unreadItem: {
    backgroundColor: "#fff1f2 !important",
    "&:hover": {
      backgroundColor: "#ffe4e6 !important",
    },
  },
  iconBox: {
    width: "40px",
    height: "40px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  notifContent: {
    flex: 1,
  },
  notifMessage: {
    fontSize: "0.85rem !important",
    fontWeight: "600 !important",
    color: "#334155",
    lineHeight: "1.4 !important",
    marginBottom: "0.25rem !important",
  },
  notifTime: {
    fontSize: "0.75rem !important",
    color: "#94a3b8",
    fontWeight: "500 !important",
  },
  emptyNotif: {
    padding: "3rem 2rem",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1rem",
  },
  emptyText: {
    color: "#94a3b8",
    fontSize: "0.9rem",
    fontWeight: "500",
  },
}));

const AdminHeader = ({ title }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const alert = useAlert();
  const history = useHistory();
  const { user } = useSelector((state) => state.userData);
  const { notifications, isUpdated, isDeleted, isAllMarked } = useSelector((state) => state.notifications);

  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElNotif, setAnchorElNotif] = useState(null);
  
  const open = Boolean(anchorEl);
  const openNotif = Boolean(anchorElNotif);

  useEffect(() => {
    dispatch(getNotifications());
    if (isUpdated) {
      dispatch({ type: "MARK_AS_READ_RESET" });
    }
    if (isDeleted) {
      dispatch({ type: "CLEAR_ALL_NOTIFICATIONS_RESET" });
    }
    if (isAllMarked) {
      dispatch({ type: "MARK_ALL_READ_RESET" });
    }
  }, [dispatch, isUpdated, isDeleted, isAllMarked]);

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotifClick = (event) => {
    setAnchorElNotif(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setAnchorElNotif(null);
  };

  const handleLogout = async () => {
    const success = await dispatch(logout());
    if (success) {
      alert.success("Logged out successfully");
      handleClose();
      history.push("/login");
    }
  };

  const handleAccount = () => {
    history.push("/admin/settings");
    handleClose();
  };

  const handleSettings = () => {
    history.push("/admin/settings");
    handleClose();
  };

  const handleNotifItemClick = (notif) => {
    if (!notif.read) {
      dispatch(markNotificationAsRead(notif._id));
    }
    history.push(notif.link);
    handleClose();
  };

  const handleClearAll = () => {
    dispatch(clearAllNotifications());
    alert.success("All notifications cleared");
    handleClose();
  };

  const getNotifIcon = (type) => {
    switch (type) {
      case "new_order":
        return { icon: <ShoppingBagOutlinedIcon sx={{ fontSize: 20 }} />, color: "#3b82f6", bg: "#eff6ff" };
      case "new_vendor":
        return { icon: <StorefrontIcon sx={{ fontSize: 20 }} />, color: "#10b981", bg: "#ecfdf5" };
      case "payment_update":
        return { icon: <PaymentIcon sx={{ fontSize: 20 }} />, color: "#f59e0b", bg: "#fffbeb" };
      case "kyc_request":
        return { icon: <VerifiedUserIcon sx={{ fontSize: 20 }} />, color: "#8b5cf6", bg: "#f5f3ff" };
      default:
        return { icon: <NotificationsNoneIcon sx={{ fontSize: 20 }} />, color: "#64748b", bg: "#f1f5f9" };
    }
  };

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
  };

  const unreadCount = notifications ? notifications.filter(n => !n.read).length : 0;

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
        <IconButton className={classes.iconButton} onClick={handleNotifClick}>
          <Badge 
            badgeContent={unreadCount} 
            color="secondary" 
            sx={{ "& .MuiBadge-badge": { backgroundColor: "#EC4899" } }}
          >
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

        {/* Notifications Menu */}
        <Menu
          anchorEl={anchorElNotif}
          open={openNotif}
          onClose={handleClose}
          PaperProps={{ className: classes.notificationMenu }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <Box className={classes.notificationHeader}>
            <Typography className={classes.notificationTitle}>Notifications</Typography>
            {notifications && notifications.length > 0 && (
              <Button className={classes.clearAllBtn} onClick={handleClearAll}>
                Clear All
              </Button>
            )}
          </Box>
          
          <Box className={classes.notificationList}>
            {notifications && notifications.length > 0 ? (
              notifications.map((notif) => {
                const { icon, color, bg } = getNotifIcon(notif.type);
                return (
                  <MenuItem 
                    key={notif._id} 
                    onClick={() => handleNotifItemClick(notif)}
                    className={`${classes.notificationItem} ${!notif.read ? classes.unreadItem : ""}`}
                  >
                    <Box className={classes.iconBox} style={{ backgroundColor: bg, color: color }}>
                      {icon}
                    </Box>
                    <Box className={classes.notifContent}>
                      <Typography className={classes.notifMessage}>{notif.message}</Typography>
                      <Typography className={classes.notifTime}>{timeAgo(notif.createdAt)}</Typography>
                    </Box>
                  </MenuItem>
                );
              })
            ) : (
              <Box className={classes.emptyNotif}>
                <NotificationsNoneIcon sx={{ fontSize: 48, color: "#e2e8f0" }} />
                <Typography className={classes.emptyText}>No new notifications</Typography>
              </Box>
            )}
          </Box>
          {notifications && notifications.length > 0 && (
            <Box sx={{ p: 1, textAlign: "center", borderTop: "1px solid #f1f5f9" }}>
              <Button 
                fullWidth 
                sx={{ textTransform: "none", color: "#64748b", fontWeight: 600, fontSize: "0.85rem" }}
                onClick={() => {
                  dispatch(markAllNotificationsRead());
                  handleClose();
                }}
              >
                Mark all as read
              </Button>
            </Box>
          )}
        </Menu>

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
          <MenuItem onClick={handleSettings} className={classes.menuItem}>
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
