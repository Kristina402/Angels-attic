import React, { useState, useEffect } from "react";
import { DataGrid } from "@material-ui/data-grid";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useAlert } from "react-alert";
import { Button, Box, Typography, Paper, IconButton, Chip, Tooltip } from "@mui/material";
import MetaData from "../layouts/MataData/MataData";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import Loader from "../layouts/loader/Loader";
import { getAllUsers, clearErrors, deleteUser, updateUser } from "../../actions/userAction";
import { DELETE_USER_RESET, UPDATE_USER_RESET } from "../../constants/userConstanat";
import { useHistory } from "react-router-dom";
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

function UserList() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { error, users, loading } = useSelector((state) => state.allUsers);
  const { error: deleteError, isDeleted, message } = useSelector(
    (state) => state.profileData
  );
  const { isUpdated } = useSelector((state) => state.profileData);
  const alert = useAlert();
  const history = useHistory();

  const deleteUserHandler = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      dispatch(deleteUser(id));
    }
  };

  const blockUserHandler = (id, currentStatus) => {
    const newStatus = currentStatus === "Active" ? "Blocked" : "Active";
    if (window.confirm(`Are you sure you want to ${newStatus === "Blocked" ? "block" : "unblock"} this user?`)) {
      dispatch(updateUser(id, { status: newStatus }));
    }
  };

  const approveVendorHandler = (id, isApproved) => {
    if (window.confirm(`Are you sure you want to ${isApproved ? "disapprove" : "approve"} this vendor?`)) {
      dispatch(updateUser(id, { isApproved: !isApproved }));
    }
  };

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
      alert.success(message);
      dispatch({ type: DELETE_USER_RESET });
    }

    if (isUpdated) {
      alert.success("User status updated successfully");
      dispatch({ type: UPDATE_USER_RESET });
    }

    dispatch(getAllUsers());
  }, [dispatch, alert, error, deleteError, isDeleted, message, isUpdated]);

  const columns = [
    {
      field: "name",
      headerName: "Name",
      minWidth: 150,
      flex: 0.5,
    },
    {
      field: "email",
      headerName: "Email",
      minWidth: 200,
      flex: 0.7,
    },
    {
      field: "role",
      headerName: "Role",
      minWidth: 120,
      flex: 0.3,
      renderCell: (params) => {
        const role = params.getValue(params.id, "role");
        return (
          <Chip 
            label={role} 
            size="small"
            sx={{ 
              backgroundColor: role === "admin" ? "#EFF6FF" : "#F8F9FB",
              color: role === "admin" ? "#3B82F6" : "#64748b",
              fontWeight: "700",
              textTransform: "capitalize"
            }}
          />
        );
      },
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 150,
      flex: 0.3,
      renderCell: (params) => {
        const status = params.getValue(params.id, "status");
        return (
          <Chip 
            label={status} 
            size="small"
            sx={{ 
              backgroundColor: status === "Active" ? "#ECFDF5" : "#FEF2F2",
              color: status === "Active" ? "#10B981" : "#EF4444",
              fontWeight: "700"
            }}
          />
        );
      },
    },
    {
      field: "approval",
      headerName: "Approval",
      minWidth: 150,
      flex: 0.3,
      renderCell: (params) => {
        const role = params.getValue(params.id, "role");
        const isApproved = params.getValue(params.id, "isApproved");
        if (role === "vendor") {
          return (
            <Chip 
              label={isApproved ? "Approved" : "Pending"} 
              size="small"
              sx={{ 
                backgroundColor: isApproved ? "#ECFDF5" : "#FEF2F2",
                color: isApproved ? "#10B981" : "#EF4444",
                fontWeight: "700"
              }}
            />
          );
        }
        return <span>-</span>;
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 180,
      flex: 0.4,
      sortable: false,
      renderCell: (params) => {
        const id = params.getValue(params.id, "id");
        const status = params.getValue(params.id, "status");
        const role = params.getValue(params.id, "role");
        const isApproved = params.getValue(params.id, "isApproved");

        return (
          <Box sx={{ display: "flex", gap: "0.5rem" }}>
            {role === "vendor" && (
              <Tooltip title={isApproved ? "Disapprove Vendor" : "Approve Vendor"}>
                <IconButton size="small" onClick={() => approveVendorHandler(id, isApproved)}>
                  <CheckCircleOutlineIcon sx={{ color: isApproved ? "#10B981" : "#94a3b8" }} />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title={status === "Active" ? "Block User" : "Unblock User"}>
              <IconButton size="small" onClick={() => blockUserHandler(id, status)}>
                <BlockIcon sx={{ color: status === "Active" ? "#F59E0B" : "#10B981" }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete User">
              <IconButton size="small" onClick={() => deleteUserHandler(id)}>
                <DeleteIcon className={classes.deleteIcon} />
              </IconButton>
            </Tooltip>
          </Box>
        );
      },
    },
  ];

  const rows = [];
  users && users.forEach((item) => {
    rows.push({
      id: item._id,
      role: item.role,
      email: item.email,
      name: item.name,
      status: item.status || "Active",
      isApproved: item.isApproved,
    });
  });

  return (
    <Box className={classes.dashboard}>
      <MetaData title="All Users - Admin" />
      <AdminSidebar />
      <Box className={classes.mainContent}>
        <AdminHeader title="Manage Users" />
        
        <Paper className={classes.sectionPaper} sx={{ mt: 2 }}>
          <Typography className={classes.sectionTitle}>Platform Users</Typography>
          <div style={{ height: 600, width: '100%' }}>
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

export default UserList;

