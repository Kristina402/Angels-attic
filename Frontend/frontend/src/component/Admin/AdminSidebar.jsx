import React from "react";
import { Link, useLocation, useHistory } from "react-router-dom";
import { Box, Typography, List, ListItem, ListItemIcon, ListItemText, Divider, Avatar } from "@mui/material";
import { makeStyles } from "@mui/styles";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import StoreIcon from "@mui/icons-material/Store";
import InventoryIcon from "@mui/icons-material/Inventory";
import ListAltIcon from "@mui/icons-material/ListAlt";
import BarChartIcon from "@mui/icons-material/BarChart";
import AssessmentIcon from "@mui/icons-material/Assessment";
import SettingsIcon from "@mui/icons-material/Settings";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../actions/userAction";
import { useAlert } from "react-alert";

const useStyles = makeStyles((theme) => ({
  sidebar: {
    width: "280px",
    backgroundColor: "#FFFFFF",
    height: "100vh",
    position: "fixed",
    left: 0,
    top: 0,
    display: "flex",
    flexDirection: "column",
    boxShadow: "4px 0 10px rgba(0,0,0,0.02)",
    zIndex: 1200,
    overflowY: "auto",
    "&::-webkit-scrollbar": {
      width: "4px",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#f1f1f1",
      borderRadius: "10px",
    },
  },
  logoContainer: {
    padding: "2rem 1.5rem",
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
  },
  logo: {
    width: "40px",
    height: "40px",
    objectFit: "contain",
  },
  logoText: {
    fontWeight: "800 !important",
    fontSize: "1.25rem !important",
    color: "#1a1a1a",
    letterSpacing: "-0.5px",
  },
  menuList: {
    padding: "0 1rem",
  },
  menuItem: {
    borderRadius: "12px !important",
    marginBottom: "0.5rem !important",
    padding: "0.75rem 1rem !important",
    color: "#64748b !important",
    transition: "all 0.2s ease !important",
    "&:hover": {
      backgroundColor: "#FDF2F8 !important",
      color: "#EC4899 !important",
      "& .MuiListItemIcon-root": {
        color: "#EC4899 !important",
      },
    },
  },
  activeMenuItem: {
    backgroundColor: "#FDF2F8 !important",
    color: "#EC4899 !important",
    "& .MuiListItemIcon-root": {
      color: "#EC4899 !important",
    },
    "& .MuiTypography-root": {
      fontWeight: "700 !important",
    },
  },
  menuIcon: {
    minWidth: "40px !important",
    color: "inherit !important",
  },
  menuText: {
    fontSize: "0.95rem !important",
    fontWeight: "500 !important",
  },
  sectionLabel: {
    padding: "1.5rem 1.5rem 0.75rem",
    fontSize: "0.75rem !important",
    fontWeight: "700 !important",
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },
  logoutItem: {
    marginTop: "auto !important",
    marginBottom: "2rem !important",
    color: "#ef4444 !important",
    "&:hover": {
      backgroundColor: "#FEF2F2 !important",
      color: "#ef4444 !important",
      "& .MuiListItemIcon-root": {
        color: "#ef4444 !important",
      },
    },
  },
}));

const AdminSidebar = () => {
  const classes = useStyles();
  const location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();
  const alert = useAlert();
  const { user } = useSelector((state) => state.userData);

  const logoutHandler = () => {
    dispatch(logout());
    alert.success("Logged out successfully");
    history.push("/login");
  };

  const menuItems = [
    { label: "Dashboard", icon: <DashboardIcon />, path: "/admin-dashboard" },
    { label: "Manage Users", icon: <PeopleIcon />, path: "/admin/users" },
    { label: "Manage Vendors", icon: <StoreIcon />, path: "/admin/vendors" },
    { label: "Manage Products", icon: <InventoryIcon />, path: "/admin/products" },
    { label: "Orders", icon: <ListAltIcon />, path: "/admin/orders" },
  ];

  const analyticsItems = [
    { label: "Sales Analysis", icon: <BarChartIcon />, path: "/admin/analytics" },
    { label: "Reports", icon: <AssessmentIcon />, path: "/admin/reports" },
  ];

  const systemItems = [
    { label: "Settings", icon: <SettingsIcon />, path: "/admin/settings" },
  ];

  const renderMenuItems = (items) => (
    items.map((item) => (
      <ListItem
        button
        component={Link}
        to={item.path}
        key={item.label}
        className={`${classes.menuItem} ${location.pathname === item.path ? classes.activeMenuItem : ""}`}
      >
        <ListItemIcon className={classes.menuIcon}>{item.icon}</ListItemIcon>
        <ListItemText 
          primary={<Typography className={classes.menuText}>{item.label}</Typography>} 
        />
      </ListItem>
    ))
  );

  return (
    <Box className={classes.sidebar}>
      <Box className={classes.logoContainer}>
        <img src={require("../../Image/logo.png")} alt="Logo" className={classes.logo} />
        <Typography className={classes.logoText}>Angels Attic</Typography>
      </Box>

      <Typography className={classes.sectionLabel}>Main Menu</Typography>
      <List className={classes.menuList}>
        {renderMenuItems(menuItems)}
      </List>

      <Typography className={classes.sectionLabel}>Analytics</Typography>
      <List className={classes.menuList}>
        {renderMenuItems(analyticsItems)}
      </List>

      <Typography className={classes.sectionLabel}>System</Typography>
      <List className={classes.menuList}>
        {renderMenuItems(systemItems)}
      </List>

      <List className={classes.menuList} style={{ marginTop: "auto" }}>
        <ListItem button className={`${classes.menuItem} ${classes.logoutItem}`} onClick={logoutHandler}>
          <ListItemIcon className={classes.menuIcon}><ExitToAppIcon /></ListItemIcon>
          <ListItemText primary={<Typography className={classes.menuText}>Logout</Typography>} />
        </ListItem>
      </List>
    </Box>
  );
};

export default AdminSidebar;
