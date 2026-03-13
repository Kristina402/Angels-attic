import React, { useEffect } from "react";
import { DataGrid } from "@material-ui/data-grid";
import { useSelector, useDispatch } from "react-redux";
import { useAlert } from "react-alert";
import { Button, Box, Typography, Paper, IconButton, Chip, Tooltip, Stack } from "@mui/material";
import MetaData from "../layouts/MataData/MataData";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BlockIcon from "@mui/icons-material/Block";
import DeleteIcon from "@mui/icons-material/Delete";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import Loader from "../layouts/loader/Loader";
import { getAllUsers, clearErrors, deleteUser, updateUser } from "../../actions/userAction";
import { DELETE_USER_RESET, UPDATE_USER_RESET } from "../../constants/userConstanat";
import { makeStyles } from "@mui/styles";

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
  approveIcon: {
    color: "#10B981",
    "&:hover": {
      color: "#059669",
    },
  },
  blockIcon: {
    color: "#F59E0B",
    "&:hover": {
      color: "#D97706",
    },
  },
  deleteIcon: {
    color: "#EF4444",
    "&:hover": {
      color: "#DC2626",
    },
  },
}));

const VendorList = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const alert = useAlert();

  const { error, users, loading } = useSelector((state) => state.allUsers);
  const { error: updateError, isUpdated } = useSelector((state) => state.profileData);
  const { error: deleteError, isDeleted, message } = useSelector((state) => state.profileData);

  const deleteVendorHandler = (id) => {
    if (window.confirm("Are you sure you want to delete this vendor?")) {
      dispatch(deleteUser(id));
    }
  };

  const updateVendorStatusHandler = (id, status) => {
    const userData = { isApproved: status };
    dispatch(updateUser(id, userData)).then(() => {
      window.location.reload();
    });
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (updateError) {
      alert.error(updateError);
      dispatch(clearErrors());
    }
    if (deleteError) {
      alert.error(deleteError);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      alert.success("Vendor status updated successfully");
      dispatch({ type: UPDATE_USER_RESET });
      dispatch(getAllUsers()); // Re-fetch users after update
    }

    if (isDeleted) {
      alert.success(message || "Vendor deleted successfully");
      dispatch({ type: DELETE_USER_RESET });
    }

    dispatch(getAllUsers());
  }, [dispatch, alert, error, updateError, deleteError, isUpdated, isDeleted, message]);

  const columns = [
    { field: "name", headerName: "Vendor Name", minWidth: 150, flex: 0.5 },
    { field: "email", headerName: "Email", minWidth: 200, flex: 0.7 },
    { field: "storeName", headerName: "Shop Name", minWidth: 150, flex: 0.5 },
    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.3,
      renderCell: (params) => {
        const isApproved = params.row.status;
        return (
          <Chip
            label={isApproved ? "Approved" : "Pending"}
            size="small"
            sx={{
              backgroundColor: isApproved ? "#ECFDF5" : "#FEF2F2",
              color: isApproved ? "#10B981" : "#EF4444",
              fontWeight: "700",
            }}
          />
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 150,
      flex: 0.4,
      sortable: false,
      renderCell: (params) => {
        const id = params.row.id;
        const isApproved = params.row.status;
        return (
          <Stack direction="row" spacing={1}>
            {!isApproved ? (
              <Tooltip title="Approve Vendor">
                <IconButton size="small" onClick={() => updateVendorStatusHandler(id, true)}>
                  <CheckCircleIcon className={classes.approveIcon} />
                </IconButton>
              </Tooltip>
            ) : (
              <Tooltip title="Block Vendor">
                <IconButton size="small" onClick={() => updateVendorStatusHandler(id, false)}>
                  <BlockIcon className={classes.blockIcon} />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title="Delete Vendor">
              <IconButton size="small" onClick={() => deleteVendorHandler(id)}>
                <DeleteIcon className={classes.deleteIcon} />
              </IconButton>
            </Tooltip>
          </Stack>
        );
      },
    },
  ];

  const rows = [];
  users &&
    users
      .filter((user) => user.role === "vendor")
      .forEach((item) => {
        rows.push({
          id: item._id,
          name: item.name,
          email: item.email,
          storeName: item.storeName || "N/A",
          status: item.isApproved,
        });
      });

  return (
    <Box className={classes.dashboard}>
      <MetaData title="Manage Vendors - Admin Dashboard" />
      <AdminSidebar />
      <Box className={classes.mainContent}>
        <AdminHeader title="Manage Vendors" />
        <Paper className={classes.sectionPaper} sx={{ mt: 2 }}>
          <Typography className={classes.sectionTitle}>Vendor List</Typography>
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
};

export default VendorList;
