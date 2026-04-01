import React, { useEffect } from "react";
import { DataGrid } from "@material-ui/data-grid";
import { useSelector, useDispatch } from "react-redux";
import {
  getAllOrders,
  clearErrors,
  deleteOrder,
} from "../../actions/orderAction";
import { Link, useHistory } from "react-router-dom";
import { useAlert } from "react-alert";
import { Button, Typography, Box, Paper, IconButton, Chip, Tooltip, Drawer, Divider, Grid } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import OrderDetailsSection from "../Cart/OrderDetails";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import { useState } from "react";
import MetaData from "../layouts/MataData/MataData";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import { DELETE_ORDER_RESET } from "../../constants/orderConstant";
import { makeStyles } from "@mui/styles";
import Loader from "../layouts/loader/Loader";

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
    padding: "1.5rem",
    borderRadius: "16px !important",
    border: "none !important",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.01) !important",
  },
  sectionTitle: {
    fontSize: "1.25rem !important",
    fontWeight: "800 !important",
    color: "#1a1a1a",
    marginBottom: "1.5rem !important",
  },
  dataGrid: {
    border: "none !important",
    "& .MuiDataGrid-columnHeader": {
      backgroundColor: "#F8F9FB",
      color: "#64748b",
      fontWeight: "700",
      fontSize: "0.8rem",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    "& .MuiDataGrid-row": {
      "&:hover": {
        backgroundColor: "#f1f5f9 !important",
      },
    },
    "& .MuiDataGrid-cell": {
      fontSize: "0.9rem",
      color: "#334155",
      padding: "12px !important",
      display: "flex",
      alignItems: "center",
    },
  },
  actionIcon: {
    color: "#64748b",
    "&:hover": {
      color: "#EC4899",
    },
  },
  deleteIcon: {
    color: "#64748b",
    "&:hover": {
      color: "#EF4444",
    },
  },
  drawerPaper: {
    padding: "2rem",
    width: "500px",
    backgroundColor: "#F8F9FB !important",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
  detailCard: {
    padding: "1.5rem",
    borderRadius: "16px !important",
    marginBottom: "1.5rem",
    backgroundColor: "#fff !important",
    boxShadow: "0 2px 4px rgba(0,0,0,0.02) !important",
  },
  detailTitle: {
    fontSize: "1rem !important",
    fontWeight: "800 !important",
    color: "#1a1a1a",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    marginBottom: "1.2rem !important",
  },
  detailLabel: {
    fontSize: "0.85rem !important",
    color: "#64748b",
    fontWeight: "600 !important",
  },
  detailValue: {
    fontSize: "0.95rem !important",
    color: "#1e293b",
    fontWeight: "700 !important",
    marginTop: "0.2rem",
  },
}));

function OrderList() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const alert = useAlert();

  const { error, loading, orders } = useSelector((state) => state.allOrders);
  const { error: deleteError, isDeleted } = useSelector(
    (state) => state.deleteUpdateOrder
  );

  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (deleteError) {
      alert.error(deleteError);
      dispatch(clearErrors());
    }
    if (isDeleted) {
      alert.success("Order Deleted Successfully");
      history.push("/admin/orders");
      dispatch({ type: DELETE_ORDER_RESET });
    }
    dispatch(getAllOrders());
  }, [dispatch, error, alert, isDeleted, deleteError, history]);

  const deleteOrderHandler = (id) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      dispatch(deleteOrder(id));
    }
  };

  const viewOrderHandler = (id) => {
    const order = orders.find((o) => o._id === id);
    setSelectedOrder(order);
    setOpenDrawer(true);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return { color: "#10B981", bgColor: "#ECFDF5" };
      case "processing":
        return { color: "#F59E0B", bgColor: "#FFFBEB" };
      case "shipped":
        return { color: "#3B82F6", bgColor: "#EFF6FF" };
      case "cancelled":
        return { color: "#EF4444", bgColor: "#FEF2F2" };
      default:
        return { color: "#64748B", bgColor: "#F8F9FB" };
    }
  };

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 200, flex: 0.5 },
    {
      field: "status",
      headerName: "Status",
      minWidth: 150,
      flex: 0.3,
      renderCell: (params) => {
        const status = params.value;
        const style = getStatusColor(status);
        return (
          <Chip
            label={status}
            size="small"
            sx={{
              backgroundColor: style.bgColor,
              color: style.color,
              fontWeight: "700",
            }}
          />
        );
      },
    },
    {
      field: "customerName",
      headerName: "Customer Name",
      minWidth: 150,
      flex: 0.5,
    },
    {
      field: "productName",
      headerName: "Product Name",
      minWidth: 200,
      flex: 0.7,
    },
    {
      field: "vendorName",
      headerName: "Vendor(s)",
      minWidth: 180,
      flex: 0.6,
      renderCell: (params) => (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
          {params.value.split(", ").map((v, i) => (
            <Chip 
              key={i} 
              label={v} 
              size="small" 
              sx={{ 
                bgcolor: "#F1F5F9", 
                color: "#475569", 
                fontWeight: 700,
                fontSize: "0.75rem"
              }} 
            />
          ))}
        </Box>
      )
    },
    {
      field: "amount",
      headerName: "Amount",
      type: "number",
      minWidth: 270,
      flex: 0.5,
    },
    {
      field: "actions",
      flex: 0.3,
      headerName: "Actions",
      minWidth: 150,
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <Box sx={{ display: "flex", gap: "0.5rem" }}>
            <Tooltip title="View Order">
              <IconButton
                size="small"
                onClick={() => viewOrderHandler(params.getValue(params.id, "id"))}
              >
                <VisibilityIcon className={classes.actionIcon} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete Order">
              <IconButton
                size="small"
                onClick={() =>
                  deleteOrderHandler(params.getValue(params.id, "id"))
                }
              >
                <DeleteIcon className={classes.deleteIcon} />
              </IconButton>
            </Tooltip>
          </Box>
        );
      },
    },
  ];

  const rows = [];
  orders &&
    orders.forEach((item) => {
      rows.push({
        id: item._id,
        amount: item.totalPrice,
        status: item.orderStatus,
        customerName: item.shippingInfo.fullName || (item.shippingInfo.firstName + " " + item.shippingInfo.lastName),
        productName: item.orderItems.map(i => i.name).join(", "),
        vendorName: [...new Set(item.orderItems.map(i => i.vendorName || "N/A"))].join(", "),
      });
    });

  if (loading) return <Loader />;

  return (
    <Box className={classes.dashboard}>
      <MetaData title={`ALL Orders - Admin`} />
      <AdminSidebar />
      <Box className={classes.mainContent}>
        <AdminHeader title="Orders" />
        <Paper className={classes.sectionPaper} sx={{ mt: 2 }}>
          <Typography className={classes.sectionTitle}>Order List</Typography>
          <div style={{ height: 600, width: "100%" }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={10}
              disableSelectionOnClick
              className={classes.dataGrid}
              autoHeight
              loading={loading}
            />
          </div>
        </Paper>
      </Box>

      {/* Order Detail Drawer */}
      <Drawer
        anchor="right"
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        classes={{ paper: classes.drawerPaper }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 900, color: "#1a1a1a" }}>
            Order Details
          </Typography>
          <IconButton onClick={() => setOpenDrawer(false)} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        {selectedOrder && (
          <Box>
            <Paper className={classes.detailCard}>
              <Typography className={classes.detailTitle}>
                <LocalShippingIcon sx={{ color: "#EC4899" }} /> Shipping Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography className={classes.detailLabel}>Full Name</Typography>
                  <Typography className={classes.detailValue}>{selectedOrder.shippingInfo.fullName}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography className={classes.detailLabel}>Phone No</Typography>
                  <Typography className={classes.detailValue}>{selectedOrder.shippingInfo.phoneNo}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography className={classes.detailLabel}>Address</Typography>
                  <Typography className={classes.detailValue}>
                    {`${selectedOrder.shippingInfo.address}, ${selectedOrder.shippingInfo.city}, ${selectedOrder.shippingInfo.state}, ${selectedOrder.shippingInfo.country}`}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>

            <Paper className={classes.detailCard}>
              <Typography className={classes.detailTitle}>
                <AccountBalanceWalletIcon sx={{ color: "#EC4899" }} /> Payment & Summary
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography className={classes.detailLabel}>Status</Typography>
                  <Typography 
                    className={classes.detailValue} 
                    style={{ color: selectedOrder.paymentInfo.status === "succeeded" ? "#10B981" : "#EF4444" }}
                  >
                    {selectedOrder.paymentInfo.status === "succeeded" ? "PAID" : "UNPAID"}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography className={classes.detailLabel}>Total Amount</Typography>
                  <Typography className={classes.detailValue} sx={{ color: "#EC4899" }}>
                    Rs. {selectedOrder.totalPrice}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ my: 1.5, borderStyle: "dashed" }} />
                  <Typography className={classes.detailLabel}>Order Status</Typography>
                  <Chip 
                    label={selectedOrder.orderStatus} 
                    size="small"
                    sx={{ 
                      mt: 1,
                      fontWeight: 800,
                      backgroundColor: getStatusColor(selectedOrder.orderStatus).bgColor,
                      color: getStatusColor(selectedOrder.orderStatus).color,
                    }}
                  />
                </Grid>
              </Grid>
            </Paper>

            <Paper className={classes.detailCard}>
              <Typography className={classes.detailTitle}>
                <ShoppingBagIcon sx={{ color: "#EC4899" }} /> Ordered Items
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {selectedOrder.orderItems.map((item, index) => (
                  <Box key={index} sx={{ "&:not(:last-child)": { pb: 2, borderBottom: "1px solid #f1f5f9" } }}>
                    <OrderDetailsSection 
                      item={item} 
                      totalPrice={`Rs. ${item.price}`} 
                    />
                  </Box>
                ))}
              </Box>
            </Paper>
          </Box>
        )}
      </Drawer>
    </Box>
  );
}

export default OrderList;
