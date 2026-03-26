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
import { Button, Typography, Box, Paper, IconButton, Chip, Tooltip } from "@mui/material";
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
  deleteIcon: {
    color: "#64748b",
    "&:hover": {
      color: "#EF4444",
    },
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
    dispatch(deleteOrder(id));
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
      headerName: "Vendor Name",
      minWidth: 150,
      flex: 0.5,
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
          <Box sx={{ display: "flex", gap: "0.5rem" }}>
            <Tooltip title="View Order">
              <IconButton
                size="small"
                component={Link}
                to={`/admin/order/${params.getValue(params.id, "id")}`}
              >
                <VisibilityIcon className={classes.actionIcon} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Update Status">
              <IconButton
                size="small"
                component={Link}
                to={`/admin/order/${params.getValue(params.id, "id")}`}
              >
                <EditIcon className={classes.actionIcon} />
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
        itemsQty: item.orderItems.length,
        amount: item.totalPrice,
        status: item.orderStatus,
        customerName: item.shippingInfo.firstName + " " + item.shippingInfo.lastName,
        productName: item.orderItems[0].name,
        vendorName: item.orderItems[0].vendorName || "N/A",
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
    </Box>
  );
}

export default OrderList;
