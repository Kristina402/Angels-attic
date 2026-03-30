import React, { useEffect } from "react";
import { Box, Typography, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Avatar, Chip, Tooltip, IconButton } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useSelector, useDispatch } from "react-redux";
import { getAdminProducts, clearErrors } from "../../actions/productAction";
import { getAllOrders } from "../../actions/orderAction";
import { getAllUsers } from "../../actions/userAction";
import { getAllPayments } from "../../actions/paymentAction";

import MetaData from "../layouts/MataData/MataData";
import Loader from "../layouts/loader/Loader";
import { useAlert } from "react-alert";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import StoreIcon from "@mui/icons-material/Store";
import InventoryIcon from "@mui/icons-material/Inventory";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { dispalyMoney } from "../DisplayMoney/DisplayMoney";
import { Link } from "react-router-dom";

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
  statCard: {
    padding: "1.5rem",
    borderRadius: "16px !important",
    border: "none !important",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.01) !important",
    display: "flex",
    alignItems: "center",
    gap: "1.25rem",
    transition: "transform 0.2s ease, box-shadow 0.2s ease !important",
    "&:hover": {
      transform: "translateY(-5px)",
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05) !important",
    },
  },
  statIconBox: {
    width: "56px",
    height: "56px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "28px",
  },
  statValue: {
    fontSize: "1.5rem !important",
    fontWeight: "800 !important",
    color: "#1a1a1a",
  },
  statLabel: {
    fontSize: "0.85rem !important",
    color: "#94a3b8",
    fontWeight: "600 !important",
  },
  sectionPaper: {
    padding: "1.5rem",
    borderRadius: "16px !important",
    border: "none !important",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.01) !important",
    marginTop: "2rem",
  },
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "1.5rem",
  },
  sectionTitle: {
    fontSize: "1.1rem !important",
    fontWeight: "700 !important",
    color: "#1a1a1a",
  },
  table: {
    "& .MuiTableCell-head": {
      backgroundColor: "#F8F9FB",
      color: "#64748b",
      fontWeight: "700",
      fontSize: "0.8rem",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      borderBottom: "none",
    },
    "& .MuiTableCell-body": {
      fontSize: "0.9rem",
      color: "#4a5568",
      padding: "1rem 0.5rem",
      borderBottom: "1px solid #f1f5f9",
    },
  },
  statusChip: {
    fontWeight: "700 !important",
    fontSize: "0.75rem !important",
    borderRadius: "8px !important",
  },
  viewAllLink: {
    fontSize: "0.85rem",
    fontWeight: "700",
    color: "#EC4899",
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  },
}));

const Dashboard = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const alert = useAlert();

  const { products, loading: productsLoading, error: productsError } = useSelector((state) => state.products);
  const { orders, loading: ordersLoading, error: ordersError } = useSelector((state) => state.allOrders);
  const { users, loading: usersLoading, error: usersError } = useSelector((state) => state.allUsers);
  const { totalRevenue, loading: paymentsLoading, error: paymentsError } = useSelector((state) => state.payment);


  useEffect(() => {
    if (productsError) {
      alert.error(productsError);
      dispatch(clearErrors());
    }
    if (ordersError) {
      alert.error(ordersError);
      dispatch(clearErrors());
    }
    if (usersError) {
      alert.error(usersError);
      dispatch(clearErrors());
    }

    if (paymentsError) {
      alert.error(paymentsError);
      dispatch(clearErrors());
    }

    dispatch(getAdminProducts());
    dispatch(getAllOrders());
    dispatch(getAllUsers());
    dispatch(getAllPayments());
  }, [dispatch, alert, productsError, ordersError, usersError, paymentsError]);


  const vendorsCount = users ? users.filter(user => user.role === 'vendor').length : 0;
  const customersCount = users ? users.filter(user => user.role === 'user' || user.role === 'customer').length : 0;

  const stats = [
    { label: "Total Customers", value: customersCount, icon: <PeopleAltIcon />, color: "#3B82F6", bgColor: "#EFF6FF" },
    { label: "Total Vendors", value: vendorsCount, icon: <StoreIcon />, color: "#EC4899", bgColor: "#FDF2F8" },
    { label: "Total Products", value: products ? products.length : 0, icon: <InventoryIcon />, color: "#F59E0B", bgColor: "#FFFBEB" },
    { label: "Total Revenue", value: dispalyMoney(totalRevenue || 0), icon: <TrendingUpIcon />, color: "#10B981", bgColor: "#ECFDF5" },
  ];

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "delivered": return { color: "#10B981", bgColor: "#ECFDF5" };
      case "processing": return { color: "#F59E0B", bgColor: "#FFFBEB" };
      case "shipped": return { color: "#3B82F6", bgColor: "#EFF6FF" };
      case "cancelled": return { color: "#EF4444", bgColor: "#FEF2F2" };
      default: return { color: "#64748B", bgColor: "#F8F9FB" };
    }
  };

  if (productsLoading || ordersLoading || usersLoading || paymentsLoading) {
    return <Loader />;
  }

  return (
    <Box className={classes.dashboard}>
      <MetaData title="Admin Dashboard - Angels Attic" />
      <AdminSidebar />
      <Box className={classes.mainContent}>
        <AdminHeader title="Admin Dashboard" />
        
        <Grid container spacing={3} sx={{ mt: 1 }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper className={classes.statCard}>
                <Box className={classes.statIconBox} sx={{ backgroundColor: stat.bgColor, color: stat.color }}>
                  {stat.icon}
                </Box>
                <Box>
                  <Typography className={classes.statValue}>{stat.value}</Typography>
                  <Typography className={classes.statLabel}>{stat.label}</Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper className={classes.sectionPaper}>
              <Box className={classes.sectionHeader}>
                <Typography className={classes.sectionTitle}>Recent Orders</Typography>
                <Link to="/admin/orders" className={classes.viewAllLink}>View All</Link>
              </Box>
              <TableContainer>
                <Table className={classes.table}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Order ID</TableCell>
                      <TableCell>Customer</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orders && orders.slice(0, 5).map((order) => {
                      const statusStyle = getStatusColor(order.orderStatus);
                      return (
                        <TableRow key={order._id}>
                          <TableCell sx={{ fontWeight: "700", color: "#1a1a1a" }}>#{order._id.substring(0, 8)}</TableCell>
                          <TableCell>{order.shippingInfo.firstName} {order.shippingInfo.lastName}</TableCell>
                          <TableCell sx={{ fontWeight: "700" }}>{dispalyMoney(order.totalPrice)}</TableCell>
                          <TableCell>
                            <Chip 
                              label={order.orderStatus} 
                              className={classes.statusChip}
                              sx={{ backgroundColor: statusStyle.bgColor, color: statusStyle.color }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Tooltip title="View Details">
                              <IconButton size="small" component={Link} to={`/admin/order/${order._id}`}>
                                <TrendingUpIcon fontSize="small" sx={{ color: "#EC4899" }} />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper className={classes.sectionPaper}>
              <Box className={classes.sectionHeader}>
                <Typography className={classes.sectionTitle}>Pending Vendors</Typography>
                <Link to="/admin/vendors" className={classes.viewAllLink}>Manage</Link>
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {users && users.filter(u => u.role === 'vendor' && !u.isApproved).slice(0, 4).map((vendor) => (
                  <Box key={vendor._id} sx={{ display: "flex", alignItems: "center", gap: "1rem", p: "0.75rem", borderRadius: "12px", "&:hover": { backgroundColor: "#F8F9FB" } }}>
                    <Avatar src={vendor.avatar && vendor.avatar.url} alt={vendor.name} sx={{ width: 44, height: 44, borderRadius: "10px" }} />
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ fontWeight: "700", fontSize: "0.9rem", color: "#1a1a1a" }}>{vendor.storeName || vendor.name}</Typography>
                      <Typography sx={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: "600" }}>Pending Approval</Typography>
                    </Box>
                    <Chip label="Pending" size="small" sx={{ backgroundColor: "#FEF2F2", color: "#EF4444", fontWeight: "700", fontSize: "0.7rem" }} />
                  </Box>
                ))}
                {users && users.filter(u => u.role === 'vendor' && !u.isApproved).length === 0 && (
                  <Typography sx={{ textAlign: "center", py: 4, color: "#94a3b8", fontSize: "0.9rem" }}>No pending vendor approvals</Typography>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;
