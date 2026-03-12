import React, { useEffect, useState } from "react";
import { DataGrid } from "@material-ui/data-grid";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors } from "../../actions/orderAction";
import { Link, useHistory } from "react-router-dom";
import { useAlert } from "react-alert";
import { Button, Typography, Box, Paper, IconButton, Chip, Tooltip } from "@mui/material";
import MetaData from "../layouts/MataData/MataData";
import EditIcon from "@mui/icons-material/Edit";
import VendorSidebar from "./VendorSidebar";
import VendorHeader from "./VendorHeader";
import { makeStyles } from "@mui/styles";
import axios from "axios";
import Loader from "../layouts/loader/Loader";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

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

  const { error } = useSelector((state) => state.allOrders || {});
  
  const [vendorOrders, setVendorOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchVendorOrders = async () => {
    try {
      const { data } = await axios.get("/api/v1/vendor/orders");
      setVendorOrders(data.orders);
      setLoading(false);
    } catch (err) {
      alert.error(err.response?.data?.message || "Failed to fetch orders");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    fetchVendorOrders();
  }, [dispatch, alert, error]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "delivered": return { color: "#10B981", bgColor: "#ECFDF5" };
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
              fontWeight: "700"
            }}
          />
        );
      }
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 150,
      flex: 0.3,
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
          <Tooltip title="View Details">
            <IconButton size="small" component={Link} to={`/vendor/order/${params.getValue(params.id, "id")}`}>
              <TrendingUpIcon className={classes.actionIcon} />
            </IconButton>
          </Tooltip>
        );
      },
    },
  ];

  const rows = [];
  vendorOrders &&
    vendorOrders.forEach((item) => {
      rows.push({
        id: item._id,
        itemsQty: item.orderItems.length,
        amount: item.totalPrice,
        status: item.orderStatus,
      });
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
