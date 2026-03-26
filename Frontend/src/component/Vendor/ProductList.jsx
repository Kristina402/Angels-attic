import React, { useEffect, useState } from "react";
import { DataGrid } from "@material-ui/data-grid";
import { useSelector, useDispatch } from "react-redux";
import {
  clearErrors,
  getAdminProducts,
  deleteProduct,
} from "../../actions/productAction";
import { Link, useHistory } from "react-router-dom";
import { useAlert } from "react-alert";
import { Button, Typography, Box, Paper, IconButton, Chip, Tooltip } from "@mui/material";
import MetaData from "../layouts/MataData/MataData";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VendorSidebar from "./VendorSidebar";
import VendorHeader from "./VendorHeader";
import { DELETE_PRODUCT_RESET } from "../../constants/productsConstatns";
import { makeStyles } from "@mui/styles";
import axios from "axios";
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

const ProductList = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const alert = useAlert();
  const history = useHistory();

  const { error, products } = useSelector((state) => state.products || { products: [] });
  const { error: deleteError, isDeleted } = useSelector((state) => state.deleteUpdateProduct || {});
  
  const [vendorProducts, setVendorProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const deleteProductHandler = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteProduct(id));
    }
  };

  const fetchVendorProducts = async () => {
    try {
      const { data } = await axios.get("/api/v1/vendor/products");
      setVendorProducts(data.products);
      setLoading(false);
    } catch (err) {
      alert.error(err.response?.data?.message || "Failed to fetch products");
      setLoading(false);
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
      alert.success("Product Deleted Successfully");
      dispatch({ type: DELETE_PRODUCT_RESET });
      fetchVendorProducts();
    }

    fetchVendorProducts();
  }, [dispatch, alert, error, deleteError, isDeleted, history]);

  const columns = [
    { field: "id", headerName: "Product ID", minWidth: 200, flex: 0.5 },
    {
      field: "name",
      headerName: "Name",
      minWidth: 350,
      flex: 1,
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 150,
      flex: 0.3,
      renderCell: (params) => {
        const status = params.value;
        return (
          <Chip 
            label={status} 
            size="small"
            sx={{ 
              backgroundColor: status === "Available" ? "#ECFDF5" : "#FEF2F2",
              color: status === "Available" ? "#10B981" : "#EF4444",
              fontWeight: "700"
            }}
          />
        );
      }
    },
    {
      field: "price",
      headerName: "Price",
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
            <Tooltip title="Edit Product">
              <IconButton size="small" component={Link} to={`/vendor/product/${params.getValue(params.id, "id")}`}>
                <EditIcon className={classes.actionIcon} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete Product">
              <IconButton size="small" onClick={() => deleteProductHandler(params.getValue(params.id, "id"))}>
                <DeleteIcon className={classes.deleteIcon} />
              </IconButton>
            </Tooltip>
          </Box>
        );
      },
    },
  ];

  const rows = [];
  vendorProducts &&
    vendorProducts.forEach((item) => {
      rows.push({
        id: item._id,
        status: item.availabilityStatus,
        price: item.price,
        name: item.name,
      });
    });

  if (loading) return <Loader />;

  return (
    <Box className={classes.dashboard}>
      <MetaData title="All Products - Vendor" />
      <VendorSidebar />
      <Box className={classes.mainContent}>
        <VendorHeader title="My Products" />
        
        <Paper className={classes.sectionPaper} sx={{ mt: 2 }}>
          <Typography className={classes.sectionTitle}>Product Inventory</Typography>
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

export default ProductList;
