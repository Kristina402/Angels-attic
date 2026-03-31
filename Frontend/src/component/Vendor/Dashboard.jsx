import React, { useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  Tooltip,
  IconButton,
  Button,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useSelector, useDispatch } from "react-redux";
import { getAdminProducts, clearErrors } from "../../actions/productAction";
import { getAllOrders } from "../../actions/orderAction";
import { getVendorPayments } from "../../actions/paymentAction";
import MetaData from "../layouts/MataData/MataData";
import Loader from "../layouts/loader/Loader";
import { useAlert } from "react-alert";
import VendorSidebar from "./VendorSidebar";
import VendorHeader from "./VendorHeader";
import InventoryIcon from "@mui/icons-material/Inventory";
import ListAltIcon from "@mui/icons-material/ListAlt";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import RateReviewIcon from "@mui/icons-material/RateReview";
import { dispalyMoney } from "../DisplayMoney/DisplayMoney";
import { Link } from "react-router-dom";
import { getVendorReviewsAction } from "../../actions/productAction";;

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
  quickActions: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  actionBtn: {
    borderRadius: "12px !important",
    padding: "0.8rem !important",
    textTransform: "none !important",
    fontWeight: "700 !important",
    justifyContent: "flex-start !important",
    gap: "0.75rem",
  },
  addBtn: {
    backgroundColor: "#EC4899 !important",
    color: "#fff !important",
    "&:hover": {
      backgroundColor: "#DB2777 !important",
    },
  },
  editBtn: {
    borderColor: "#e2e8f0 !important",
    color: "#475569 !important",
    "&:hover": {
      borderColor: "#cbd5e1 !important",
      backgroundColor: "#f8fafc !important",
    },
  },
  deleteBtn: {
    borderColor: "#FECACA !important",
    color: "#EF4444 !important",
    "&:hover": {
      borderColor: "#FCA5A5 !important",
      backgroundColor: "#FEF2F2 !important",
    },
  },
}));

const Dashboard = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const alert = useAlert();

  const { products, loading: productsLoading, error: productsError } = useSelector((state) => state.products);
  const { orders, loading: ordersLoading, error: ordersError } = useSelector((state) => state.allOrders);
  const { reviews: vendorReviews } = useSelector((state) => state.getAllReview);
  const { user } = useSelector((state) => state.userData);
  const { vendorRevenue, loading: paymentsLoading, error: paymentsError } = useSelector((state) => state.payment);


  useEffect(() => {
    if (productsError) {
      alert.error(productsError);
      dispatch(clearErrors());
    }
    if (ordersError) {
      alert.error(ordersError);
      dispatch(clearErrors());
    }

    if (paymentsError) {
      alert.error(paymentsError);
      dispatch(clearErrors());
    }

    dispatch(getAdminProducts());
    dispatch(getAllOrders());
    dispatch(getVendorPayments());
    dispatch(getVendorReviewsAction());
  }, [dispatch, alert, productsError, ordersError, paymentsError]);


  const vendorProducts = (products && user) ? products.filter(p => (p.user && (p.user._id || p.user).toString() === user._id.toString())) : [];
  
  let totalSales = 0;
  orders && orders.forEach(order => {
    order.orderItems.forEach(item => {
      if (item.productId && vendorProducts.some(vp => vp._id === item.productId)) {
        totalSales += item.price * item.quantity;
      }
    });
  });

  const stats = [
    { label: "My Products", value: vendorProducts.length, icon: <InventoryIcon />, color: "#3B82F6", bgColor: "#EFF6FF" },
    { label: "Orders Received", value: orders ? orders.length : 0, icon: <ListAltIcon />, color: "#EC4899", bgColor: "#FDF2F8" },
    { label: "Total Reviews", value: vendorReviews ? vendorReviews.length : 0, icon: <RateReviewIcon />, color: "#F59E0B", bgColor: "#FFFBEB" },
    { label: "Total Revenue", value: dispalyMoney(vendorRevenue || 0), icon: <MonetizationOnIcon />, color: "#10B981", bgColor: "#ECFDF5" },
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

  if (productsLoading || ordersLoading || paymentsLoading) {
    return <Loader />;
  }

  return (
    <Box className={classes.dashboard}>
      <MetaData title="Vendor Dashboard - Angels Attic" />
      <VendorSidebar />
      <Box className={classes.mainContent}>
        <VendorHeader title="Dashboard" />
        
        <Grid container spacing={3} sx={{ mt: 1 }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={4} key={index}>
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
                <Link to="/vendor/orders" className={classes.viewAllLink}>View All</Link>
              </Box>
              <TableContainer>
                <Table className={classes.table}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Order ID</TableCell>
                      <TableCell>Customer</TableCell>
                      <TableCell>Product</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orders && orders
                      .map(order => {
                        const vendorItems = order.orderItems.filter(item => 
                          item.productId && vendorProducts.some(vp => vp._id === item.productId)
                        );
                        return { ...order, vendorItems };
                      })
                      .filter(order => order.vendorItems.length > 0)
                      .slice(0, 5)
                      .map((order) => {
                        const statusStyle = getStatusColor(order.orderStatus);
                        const orderVendorTotal = order.vendorItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
                        const productNames = order.vendorItems.map(item => item.name).join(", ");

                        return (
                          <TableRow key={order._id}>
                            <TableCell sx={{ fontWeight: "700", color: "#1a1a1a" }}>#{order._id.substring(0, 8)}</TableCell>
                            <TableCell>{order.shippingInfo.firstName} {order.shippingInfo.lastName}</TableCell>
                            <TableCell>
                              <Tooltip title={productNames}>
                                <Typography noWrap sx={{ maxWidth: "200px", fontSize: "inherit" }}>
                                  {productNames}
                                </Typography>
                              </Tooltip>
                            </TableCell>
                            <TableCell sx={{ fontWeight: "700" }}>{dispalyMoney(orderVendorTotal)}</TableCell>
                            <TableCell>
                              <Chip 
                                label={order.orderStatus} 
                                className={classes.statusChip}
                                sx={{ backgroundColor: statusStyle.bgColor, color: statusStyle.color }}
                              />
                            </TableCell>
                            <TableCell align="right">
                              <Tooltip title="View Details">
                                <IconButton size="small" component={Link} to={`/vendor/order/${order._id}`}>
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
                <Typography className={classes.sectionTitle}>Quick Actions</Typography>
              </Box>
              <Box className={classes.quickActions}>
                <Button 
                  fullWidth 
                  variant="contained" 
                  className={`${classes.actionBtn} ${classes.addBtn}`}
                  component={Link}
                  to="/vendor/product/new"
                  startIcon={<AddIcon />}
                >
                  Add New Product
                </Button>
                <Button 
                  fullWidth 
                  variant="outlined" 
                  className={`${classes.actionBtn} ${classes.editBtn}`}
                  component={Link}
                  to="/vendor/products"
                  startIcon={<EditIcon />}
                >
                  Edit Product
                </Button>
                <Button 
                  fullWidth 
                  variant="outlined" 
                  className={`${classes.actionBtn} ${classes.deleteBtn}`}
                  component={Link}
                  to="/vendor/products"
                  startIcon={<DeleteIcon />}
                >
                  Delete Product
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;
