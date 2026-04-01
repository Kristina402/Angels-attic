import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  updateOrder,
  clearErrors,
  getOrderDetails,
} from "../../actions/orderAction";
import MetaData from "../layouts/MataData/MataData";
import Loader from "../layouts/loader/Loader";
import { useAlert } from "react-alert";
import {
  Typography,
  Divider,
  Box,
  Paper,
  Button,
  FormControl,
  Select,
  MenuItem,
  Grid,
  Chip,
  CircularProgress,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { UPDATE_ORDER_RESET } from "../../constants/orderConstant";
import { Link, useParams } from "react-router-dom";
import OrderDetailsSection from "../Cart/OrderDetails";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import VendorSidebar from "../Vendor/VendorSidebar";
import VendorHeader from "../Vendor/VendorHeader";
import { dispalyMoney } from "../DisplayMoney/DisplayMoney";

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
  },
  sectionTitle: {
    fontSize: "1.25rem !important",
    fontWeight: "800 !important",
    color: "#1a1a1a",
    marginBottom: "1.5rem !important",
  },
  infoBox: {
    marginBottom: "2rem",
  },
  infoText: {
    fontSize: "0.95rem !important",
    color: "#4a5568",
    marginBottom: "0.5rem !important",
    "& b": {
      color: "#1a1a1a",
      marginRight: "0.5rem",
    },
  },
  statusChip: {
    fontWeight: "700 !important",
    borderRadius: "8px !important",
  },
  processBox: {
    padding: "1.5rem",
    backgroundColor: "#F8F9FB",
    borderRadius: "12px",
    marginTop: "2rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  submitBtn: {
    backgroundColor: "#EC4899 !important",
    color: "#fff !important",
    fontWeight: "700 !important",
    textTransform: "none !important",
    borderRadius: "10px !important",
    padding: "0.75rem !important",
    "&:hover": {
      backgroundColor: "#DB2777 !important",
    },
  },
}));

function ProcessOrder() {
  const { order, error, loading } = useSelector((state) => state.orderDetails);
  const { error: updateError, isUpdated, loading: updateLoading } = useSelector(
    (state) => state.deleteUpdateOrder
  );
  const { user } = useSelector((state) => state.userData);

  const dispatch = useDispatch();
  const alert = useAlert();
  const classes = useStyles();
  const params = useParams();
  const orderId = params.id;

  const [status, setStatus] = useState("");

  const isAdmin = user && user.role === "admin";
  const Sidebar = isAdmin ? AdminSidebar : VendorSidebar;
  const Header = isAdmin ? AdminHeader : VendorHeader;

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (updateError) {
      alert.error(updateError);
      dispatch(clearErrors());
    }
    if (isUpdated) {
      alert.success("Order Status Updated Successfully");
      dispatch({ type: UPDATE_ORDER_RESET });
    }
    dispatch(getOrderDetails(orderId));
  }, [dispatch, alert, error, isUpdated, updateError, orderId]);

  const updateOrderSubmitHandler = (e) => {
    e.preventDefault();
    const myData = {
      status: status,
    };
    dispatch(updateOrder(orderId, myData));
  };

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered": return { color: "#10B981", bgColor: "#ECFDF5" };
      case "shipped": return { color: "#3B82F6", bgColor: "#EFF6FF" };
      case "processing": return { color: "#F59E0B", bgColor: "#FFFBEB" };
      case "confirmed": return { color: "#8B5CF6", bgColor: "#F5F3FF" };
      case "pending": return { color: "#6366F1", bgColor: "#EEF2FF" };
      default: return { color: "#64748B", bgColor: "#F8F9FB" };
    }
  };

  const statuses = ["Pending", "Confirmed", "Processing", "Shipped", "Delivered"];

  return (
    <Box className={classes.dashboard}>
      <MetaData title={isAdmin ? "Process Order - Admin Dashboard" : "View Order - Vendor Dashboard"} />
      <Sidebar />
      <Box className={classes.mainContent}>
        <Header title={isAdmin ? "Order Management" : "View Order Details"} />

        {loading ? (
          <Loader />
        ) : (
          <Grid container spacing={4} sx={{ mt: 1 }}>
            <Grid item xs={12} lg={8}>
              <Paper className={classes.sectionPaper}>
                <Typography className={classes.sectionTitle}>Order Information</Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Box className={classes.infoBox}>
                      <Typography variant="h6" sx={{ fontSize: "1rem", fontWeight: 700, mb: 2, color: "#1a1a1a" }}>
                        Shipping Details
                      </Typography>
                      <Typography className={classes.infoText}><b>Name:</b> {order.shippingInfo?.fullName}</Typography>
                      <Typography className={classes.infoText}><b>Phone:</b> {order.shippingInfo?.phoneNo}</Typography>
                      <Typography className={classes.infoText}><b>Email:</b> {order.shippingInfo?.email}</Typography>
                      <Typography className={classes.infoText}><b>Address:</b> {
                        [
                          order.shippingInfo?.address,
                          order.shippingInfo?.city,
                          order.shippingInfo?.state,
                          order.shippingInfo?.country
                        ].filter(Boolean).join(", ") + (order.shippingInfo?.pinCode ? ` - ${order.shippingInfo?.pinCode}` : "")
                      }</Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Box className={classes.infoBox}>
                      <Typography variant="h6" sx={{ fontSize: "1rem", fontWeight: 700, mb: 2, color: "#1a1a1a" }}>
                        Payment Details
                      </Typography>
                      <Typography 
                        sx={{ 
                          color: order.paymentInfo?.status === "succeeded" || order.paymentInfo?.status === "Paid" ? "#10B981" : "#EF4444",
                          fontWeight: 800,
                          fontSize: "1rem",
                          mb: 1
                        }}
                      >
                        {order.paymentInfo?.status === "succeeded" || order.paymentInfo?.status === "Paid" ? "PAID SUCCESSFULLY" : "PAYMENT PENDING"}
                      </Typography>
                      <Typography className={classes.infoText}><b>Method:</b> {order.paymentInfo?.method || (order.paymentInfo?.id === "Cash on Delivery" ? "COD" : "eSewa")}</Typography>
                      <Typography className={classes.infoText}><b>Total Amount:</b> {dispalyMoney(order.totalPrice)}</Typography>
                      <Typography className={classes.infoText}><b>Paid At:</b> {order.paidAt ? new Date(order.paidAt).toLocaleDateString() : "N/A"}</Typography>
                    </Box>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 4 }} />

                <Box className={classes.infoBox}>
                  <Typography variant="h6" sx={{ fontSize: "1.1rem", fontWeight: 700, mb: 3 }}>
                    Ordered Items ({order.orderItems?.length})
                  </Typography>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {order.orderItems?.map((item, idx) => (
                      <Link to={`/product/${item.productId}`} key={idx} style={{ textDecoration: "none", color: "inherit" }}>
                        <OrderDetailsSection item={item} totalPrice={`Rs. ${item.price}`} />
                      </Link>
                    ))}
                  </Box>
                </Box>
              </Paper>
            </Grid>

            <Grid item xs={12} lg={4}>
              <Paper className={classes.sectionPaper} sx={{ height: "fit-content", position: "sticky", top: "100px" }}>
                <Typography className={classes.sectionTitle}>Action Center</Typography>
                
                {order.orderStatus === "Delivered" ? (
                  <Box sx={{ textAlign: "center", p: 4, backgroundColor: "#ECFDF5", borderRadius: "16px", border: "1px dashed #10B981" }}>
                    <Typography sx={{ color: "#10B981", fontWeight: 800, fontSize: "1.1rem" }}>
                      ✔ Order Delivered
                    </Typography>
                    <Typography sx={{ color: "#047857", fontSize: "0.85rem", mt: 1 }}>
                      This order has been completed and cannot be edited.
                    </Typography>
                  </Box>
                ) : user && user.role === "vendor" ? (
                  <Box className={classes.processBox} sx={{ mt: 0 }}>
                    <Typography variant="h6" sx={{ fontSize: "0.95rem", fontWeight: 800, mb: 2.5, color: "#1a1a1a" }}>
                      Update Order Status
                    </Typography>
                    
                    <form className={classes.form} onSubmit={updateOrderSubmitHandler}>
                      <FormControl fullWidth size="medium">
                        <Select
                          value={status}
                          onChange={(e) => setStatus(e.target.value)}
                          displayEmpty
                          sx={{ 
                            borderRadius: "12px", 
                            backgroundColor: "#fff",
                            "& .MuiSelect-select": { py: 1.5 }
                          }}
                        >
                          <MenuItem value="" disabled>Select New Status</MenuItem>
                          {statuses.map((s) => (
                            <MenuItem 
                              key={s} 
                              value={s}
                              disabled={s === order.orderStatus}
                            >
                              {s}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        className={classes.submitBtn}
                        disabled={loading || updateLoading || status === ""}
                        startIcon={updateLoading ? <CircularProgress size={20} color="inherit" /> : <CheckCircleIcon />}
                        sx={{ py: 1.5 }}
                      >
                        {updateLoading ? "Updating..." : "Confirm Update"}
                      </Button>
                    </form>
                  </Box>
                ) : (
                  <Box sx={{ textAlign: "center", p: 3, backgroundColor: "#F1F5F9", borderRadius: "12px" }}>
                    <Typography sx={{ color: "#64748b", fontWeight: 600, fontSize: "0.9rem" }}>
                      View Only Mode
                    </Typography>
                    <Typography sx={{ color: "#94a3b8", fontSize: "0.75rem", mt: 0.5 }}>
                      Orders are managed by their respective vendors.
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Grid>
          </Grid>
        )}
      </Box>
    </Box>
  );
}

export default ProcessOrder;
