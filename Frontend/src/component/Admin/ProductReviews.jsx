import React, { useEffect, useState } from "react";
import { DataGrid } from "@material-ui/data-grid";
import { useSelector, useDispatch } from "react-redux";
import { useAlert } from "react-alert";
import {
  getAllReviews,
  getVendorReviewsAction,
  clearErrors,
  deleteReview,
} from "../../actions/productAction";
import { useHistory } from "react-router-dom";
import MetaData from "../layouts/MataData/MataData";
import Loader from "../layouts/loader/Loader";
import DeleteIcon from "@mui/icons-material/Delete";
import Star from "@mui/icons-material/Star";
import {
  Avatar,
  Button,
  TextField,
  Typography,
  InputAdornment,
  Box,
  Paper,
  IconButton,
  Tooltip,
} from "@mui/material";
import StarRateIcon from "@mui/icons-material/StarRate";
import { makeStyles } from "@mui/styles";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import VendorSidebar from "../Vendor/VendorSidebar";
import VendorHeader from "../Vendor/VendorHeader";
import { DELETE_REVIEW_RESET } from "../../constants/productsConstatns";

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
    [theme.breakpoints.down("999")]: {
      marginLeft: 0,
      padding: "1rem",
    },
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
      whiteSpace: "normal !important",
      wordWrap: "break-word !important",
      lineHeight: "1.2 !important",
      display: "flex !important",
      alignItems: "center !important",
      padding: "8px !important",
    },
    "& .MuiDataGrid-row": {
      maxHeight: "none !important",
    },
    "& .MuiDataGrid-viewport": {
      overflowX: "auto !important",
    },
  },
  searchForm: {
    maxWidth: "400px",
    margin: "0 auto 2rem auto",
    padding: "2rem",
    textAlign: "center",
  },
  avatar: {
    margin: "0 auto 1rem auto",
    backgroundColor: "#FDF2F8 !important",
    color: "#EC4899 !important",
  },
  textField: {
    marginBottom: "1.5rem !important",
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
    },
  },
  searchBtn: {
    backgroundColor: "#000 !important",
    color: "#fff !important",
    padding: "0.8rem !important",
    borderRadius: "12px !important",
    textTransform: "none !important",
    fontWeight: "600 !important",
    "&:hover": {
      backgroundColor: "#222 !important",
    },
    "&:disabled": {
      backgroundColor: "#ccc !important",
    },
  },
  actionIcon: {
    color: "#64748b",
    "&:hover": {
      color: "#EF4444",
    },
  },
  greenColor: {
    color: "#10B981 !important",
    fontWeight: "700",
  },
  redColor: {
    color: "#EF4444 !important",
    fontWeight: "700",
  },
}));

function ProductReviews() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const alert = useAlert();
  const { user } = useSelector((state) => state.userData);
  const { error, reviews, loading } = useSelector(
    (state) => state.getAllReview
  );
  const { error: deleteError, isDeleted } = useSelector(
    (state) => state.deleteReview
  );

  const [productId, setProductId] = useState("");

  useEffect(() => {
    if (user && user.role === "vendor") {
      dispatch(getVendorReviewsAction());
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (productId.length === 24 && user && user.role === "admin") {
      dispatch(getAllReviews(productId));
    }

    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (deleteError) {
      alert.error(deleteError);
      dispatch(clearErrors());
    }
    if (isDeleted) {
      alert.success("Review Deleted Successfully");
      history.push(user.role === "admin" ? "/admin/reviews" : "/vendor/reviews");
      dispatch({ type: DELETE_REVIEW_RESET });
      if (user.role === "vendor") {
        dispatch(getVendorReviewsAction());
      } else if (productId) {
        dispatch(getAllReviews(productId));
      }
    }
  }, [dispatch, error, alert, deleteError, isDeleted, productId, history, user]);

  const deleteReviewHandler = (reviewId, pId) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      dispatch(deleteReview(reviewId, pId || productId));
    }
  };

  const productReviewsSubmitHandler = (e) => {
    e.preventDefault();
    dispatch(getAllReviews(productId));
  };

  const columns = [
    {
      field: "id",
      headerName: "Review ID",
      minWidth: 100,
      flex: 0.3,
      renderCell: (params) => (
        <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
          {params.row.id.substring(0, 8)}...
        </span>
      ),
    },
    {
      field: "product",
      headerName: "Product",
      minWidth: 150,
      flex: 0.5,
      hide: user && user.role === "admin" && !productId,
    },
    {
      field: "user",
      headerName: "User",
      minWidth: 120,
      flex: 0.4,
    },
    {
      field: "comment",
      headerName: "Comment",
      minWidth: 350,
      flex: 1.5,
      renderCell: (params) => (
        <div style={{ 
          whiteSpace: "normal", 
          wordWrap: "break-word", 
          lineHeight: "1.4", 
          padding: "12px 0",
          fontSize: "0.9rem",
          color: "#334155"
        }}>
          {params.row.comment}
        </div>
      ),
    },
    {
      field: "rating",
      headerName: "Rating",
      type: "number",
      minWidth: 120,
      flex: 0.3,
      cellClassName: (params) => 
        params.row.rating >= 3 ? classes.greenColor : classes.redColor,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
          {params.row.rating}
          <Star style={{ fontSize: "16px" }} />
        </Box>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 100,
      flex: 0.3,
      sortable: false,
      renderCell: (params) => (
        <Tooltip title="Delete Review">
          <IconButton
            size="small"
            onClick={() => deleteReviewHandler(params.row.id, params.row.productId)}
          >
            <DeleteIcon className={classes.actionIcon} />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  const rows = [];
  reviews &&
    reviews.forEach((item) => {
      rows.push({
        id: item._id,
        productId: item.productId,
        product: item.productName || "N/A",
        user: item.name,
        comment: item.comment,
        rating: item.rating,
      });
    });

  if (loading) return <Loader />;

  return (
    <Box className={classes.dashboard}>
      <MetaData title="Product Reviews - Angels Attic" />
      {user && user.role === "admin" ? <AdminSidebar /> : <VendorSidebar />}
      
      <Box className={classes.mainContent}>
        {user && user.role === "admin" ? (
          <AdminHeader title="Product Reviews" />
        ) : (
          <VendorHeader title="Customer Reviews" />
        )}

        <Box sx={{ mt: 2 }}>
          {user && user.role === "admin" && (
            <Paper className={classes.sectionPaper} sx={{ mb: 4 }}>
              <form className={classes.searchForm} onSubmit={productReviewsSubmitHandler}>
                <Avatar className={classes.avatar}>
                  <StarRateIcon />
                </Avatar>
                <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>
                  Search Product Reviews
                </Typography>
                <TextField
                  variant="outlined"
                  fullWidth
                  className={classes.textField}
                  label="Enter Product ID"
                  required
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Star sx={{ color: "#94a3b8" }} />
                      </InputAdornment>
                    ),
                  }}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  className={classes.searchBtn}
                  disabled={loading || productId === ""}
                >
                  Search Reviews
                </Button>
              </form>
            </Paper>
          )}

          {reviews && reviews.length > 0 ? (
            <Paper className={classes.sectionPaper}>
              <Typography className={classes.sectionTitle}>
                {user && user.role === "vendor" ? "My Product Reviews" : "Search Results"}
              </Typography>
              <div style={{ width: '100%' }}>
                <DataGrid
                  rows={rows}
                  columns={columns}
                  pageSize={10}
                  autoHeight
                  rowHeight={120}
                  disableSelectionOnClick
                  className={classes.dataGrid}
                />
              </div>
            </Paper>
          ) : (
            <Paper className={classes.sectionPaper} sx={{ textAlign: "center", py: 8 }}>
              <Typography variant="h5" color="textSecondary">
                No reviews found
              </Typography>
            </Paper>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default ProductReviews;
