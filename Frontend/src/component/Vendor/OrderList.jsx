import React, { useEffect, useState } from "react";
import { DataGrid } from "@material-ui/data-grid";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, deleteOrder, updateOrder, getAllOrders } from "../../actions/orderAction";
import { getAdminProducts } from "../../actions/productAction";
import { dispalyMoney } from "../DisplayMoney/DisplayMoney";
import { Link, useHistory } from "react-router-dom";
import { useAlert } from "react-alert";
import { Button, Typography, Box, Paper, IconButton, Chip, Tooltip, FormControl, Select, MenuItem } from "@mui/material";
import MetaData from "../layouts/MataData/MataData";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VendorSidebar from "./VendorSidebar";
import VendorHeader from "./VendorHeader";
import { makeStyles } from "@mui/styles";
import axios from "axios";
import Loader from "../layouts/loader/Loader";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { DELETE_ORDER_RESET, UPDATE_ORDER_RESET } from "../../constants/orderConstant";

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
    "& .MuiDataGrid-cell": {
      fontSize: "0.9rem",
      color: "#4a5568",
    },
  },
  actionIcon: {
    color: "#64748b",
    "&:hover": {
      color: "#EC4899",
    },
  },
}));

const OrderList = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const alert = useAlert();
  const history = useHistory();

  const { error, orders } = useSelector((state) => state.allOrders || {});
  const { products } = useSelector((state) => state.products || {});
  const { user } = useSelector((state) => state.userData || {});
  const { error: deleteError, isDeleted, isUpdated, loading: updateLoading } = useSelector(
    (state) => state.deleteUpdateOrder || {}
  );
  
  const [loading, setLoading] = useState(true);



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
      dispatch({ type: DELETE_ORDER_RESET });
    }
    if (isUpdated) {
      alert.success("Order Status Updated Successfully");
      dispatch({ type: UPDATE_ORDER_RESET });
    }

    dispatch(getAllOrders());
    dispatch(getAdminProducts());
    setLoading(false);
  }, [dispatch, alert, error, deleteError, isDeleted, isUpdated]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "delivered": return { color: "#10B981", bgColor: "#ECFDF5" };
      case "pending": return { color: "#6366F1", bgColor: "#EEF2FF" };
      case "processing": return { color: "#F59E0B", bgColor: "#FFFBEB" };
      case "shipped": return { color: "#3B82F6", bgColor: "#EFF6FF" };
      case "cancelled": return { color: "#EF4444", bgColor: "#FEF2F2" };
      default: return { color: "#64748B", bgColor: "#F8F9FB" };
    }
  };

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 200, flex: 0.5 },
    {
      field: "status",
      headerName: "Status",
      minWidth: 180,
      flex: 0.4,
      renderCell: (params) => {
        const orderId = params.getValue(params.id, "id");
        const currentStatus = params.value;
        const style = getStatusColor(currentStatus);
        
        return (
          <FormControl 
            fullWidth 
            size="small" 
            variant="outlined"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          >
            <Select
              value={currentStatus}
              onChange={(e) => updateStatusHandler(orderId, e.target.value)}
              disabled={updateLoading}
              MenuProps={{
                disablePortal: false,
                PaperProps: {
                  sx: {
                    bgcolor: "white !important",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1) !important",
                    borderRadius: "12px !important",
                    zIndex: 2000,
                    "& .MuiList-root": {
                      padding: "8px !important",
                      display: "flex !important",
                      flexDirection: "column !important",
                      gap: "4px !important",
                    },
                    "& .MuiMenuItem-root": {
                      fontSize: "0.85rem !important",
                      fontWeight: "600 !important",
                      padding: "10px 16px !important",
                      borderRadius: "8px !important",
                      color: "#475569 !important",
                      whiteSpace: "nowrap !important",
                      "&.Mui-selected": {
                        bgcolor: "#F1F5F9 !important",
                        color: "#EC4899 !important",
                      },
                      "&:hover": {
                        bgcolor: "#FDF2F8 !important",
                        color: "#EC4899 !important",
                      },
                    },
                  },
                },
              }}
              sx={{
                height: "35px",
                fontSize: "0.85rem",
                fontWeight: "700",
                backgroundColor: style.bgColor,
                color: style.color,
                borderRadius: "8px",
                "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                "& .MuiSelect-select": { paddingRight: "30px !important" },
              }}
            >
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Confirmed">Confirmed</MenuItem>
              <MenuItem value="Processing">Processing</MenuItem>
              <MenuItem value="Shipped">Shipped</MenuItem>
              <MenuItem value="Delivered">Delivered</MenuItem>
            </Select>
          </FormControl>
        );
      }
    },
    {
      field: "customerName",
      headerName: "Customer",
      minWidth: 150,
      flex: 0.4,
    },
    {
      field: "productName",
      headerName: "Product(s)",
      minWidth: 200,
      flex: 0.6,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <Typography noWrap sx={{ fontSize: "0.85rem" }}>
            {params.value}
          </Typography>
        </Tooltip>
      )
    },
    {
      field: "amount",
      headerName: "Price",
      type: "number",
      minWidth: 150,
      flex: 0.3,
      renderCell: (params) => (
        <Typography sx={{ fontWeight: 700 }}>
          {dispalyMoney(params.value)}
        </Typography>
      )
    },
    {
      field: "actions",
      flex: 0.3,
      headerName: "Actions",
      minWidth: 150,
      type: "number",
      sortable: false,
      renderCell: (params) => {
        const id = params.getValue(params.id, "id");
        return (
          <Box sx={{ display: "flex", gap: "0.5rem" }}>
            <Tooltip title="View Details">
              <IconButton size="small" component={Link} to={`/vendor/order/${id}`}>
                <TrendingUpIcon className={classes.actionIcon} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete Order">
              <IconButton size="small" onClick={() => deleteOrderHandler(id)}>
                <DeleteIcon className={classes.deleteIcon} sx={{ color: "#64748b", "&:hover": { color: "#EF4444" } }} />
              </IconButton>
            </Tooltip>
          </Box>
        );
      },
    },
  ];

  const updateStatusHandler = (id, status) => {
    const myData = {
      status: status,
    };
    dispatch(updateOrder(id, myData));
  };

  const deleteOrderHandler = (id) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      dispatch(deleteOrder(id));
    }
  };

  const vendorProducts = products ? products.filter(p => (p.user && (p.user._id || p.user).toString() === user._id.toString())) : [];

  const rows = [];
  orders &&
    orders.forEach((item) => {
      // Filter items that belong to the current vendor
      const vendorItems = item.orderItems.filter(orderItem => 
        orderItem.productId && vendorProducts.some(vp => vp._id === orderItem.productId)
      );

      if (vendorItems.length > 0) {
        const orderVendorTotal = vendorItems.reduce((acc, orderItem) => acc + (orderItem.price * orderItem.quantity), 0);
        const productNames = vendorItems.map(orderItem => orderItem.name).join(", ");

        rows.push({
          id: item._id,
          amount: orderVendorTotal,
          status: item.orderStatus,
          customerName: item.shippingInfo.firstName + " " + item.shippingInfo.lastName,
          productName: productNames,
        });
      }
    });

  if (loading) return <Loader />;

  return (
    <Box className={classes.dashboard}>
      <MetaData title="All Orders - Vendor" />
      <VendorSidebar />
      <Box className={classes.mainContent}>
        <VendorHeader title="My Orders" />
        
        <Paper className={classes.sectionPaper} sx={{ mt: 2 }}>
          <Typography className={classes.sectionTitle}>Sales Orders</Typography>
          <div style={{ height: 600, width: '100%' }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={10}
              disableSelectionOnClick
              className={classes.dataGrid}
              autoHeight
            />
          </div>
        </Paper>
      </Box>
    </Box>
  );
};

export default OrderList;
