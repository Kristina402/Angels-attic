import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import MetaData from "../layouts/MataData/MataData";
import Loader from "../layouts/loader/Loader";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import { createProduct, clearErrors } from "../../actions/productAction";
import { useHistory } from "react-router-dom";
import { NEW_PRODUCT_RESET } from "../../constants/productsConstatns";
import {
  Avatar,
  TextField,
  Typography,
  Button,
  FormControl,
  Paper,
  Select,
  MenuItem,
  InputAdornment,
  Box,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import CollectionsIcon from "@mui/icons-material/Collections";
import InfoIcon from "@mui/icons-material/Info";
import DescriptionIcon from "@mui/icons-material/Description";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

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
    maxWidth: "800px",
    margin: "0 auto",
  },
  sectionTitle: {
    fontSize: "1.5rem !important",
    fontWeight: "800 !important",
    color: "#1a1a1a",
    marginBottom: "2rem !important",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },
  submitBtn: {
    backgroundColor: "#EC4899 !important",
    color: "#fff !important",
    padding: "1rem !important",
    borderRadius: "12px !important",
    fontWeight: "700 !important",
    textTransform: "none !important",
    fontSize: "1rem !important",
    marginTop: "1rem !important",
    "&:hover": {
      backgroundColor: "#DB2777 !important",
    },
  },
  imagePreviewBox: {
    display: "flex",
    overflowX: "auto",
    gap: "1rem",
    padding: "1rem 0",
    "& img": {
      width: "100px",
      height: "100px",
      objectFit: "cover",
      borderRadius: "10px",
      border: "2px solid #f1f5f9",
    },
  },
  uploadBtn: {
    py: 1.5,
    borderRadius: "12px",
    textTransform: "none",
    border: "1px dashed #cbd5e1",
    "&:hover": {
      backgroundColor: "#f8fafc",
      border: "1px dashed #94a3b8",
    },
  },
}));

function NewProduct() {
  const dispatch = useDispatch();
  const history = useHistory();
  const alert = useAlert();
  const classes = useStyles();

  const { loading, error, success } = useSelector((state) => state.addNewProduct);
  
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [size, setSize] = useState("");
  const [condition, setCondition] = useState("Pre-loved");
  const [info, setInfo] = useState("");
  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);
  const fileInputRef = useRef();

  const categories = ["bags", "bottoms", "footwares", "jackets", "skirts", "tops"];
  const sizes = ["XS", "S", "M", "L", "XL", "XXL", "Free Size"];
  const conditions = ["New", "Like New", "Pre-loved"];

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (success) {
      alert.success("Product Created Successfully");
      history.push("/admin/products");
      dispatch({ type: NEW_PRODUCT_RESET });
    }
  }, [dispatch, alert, error, history, success]);

  const createProductSubmitHandler = (e) => {
    e.preventDefault();
    const myForm = new FormData();
    myForm.set("name", name);
    myForm.set("price", price);
    myForm.set("description", description);
    myForm.set("category", category);
    myForm.set("size", size);
    myForm.set("condition", condition);
    myForm.set("info", info);
    images.forEach((currImg) => {
      myForm.append("images", currImg);
    });

    dispatch(createProduct(myForm));
  };

  const createProductImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setImages([]);
    setImagesPreview([]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview((old) => [...old, reader.result]);
          setImages((old) => [...old, reader.result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <Box className={classes.dashboard}>
      <MetaData title="New Product - Admin" />
      <AdminSidebar />
      <Box className={classes.mainContent}>
        <AdminHeader title="Create Product" />

        {loading ? (
          <Loader />
        ) : (
          <Paper className={classes.sectionPaper}>
            <Typography className={classes.sectionTitle}>Add New Thrift Item</Typography>

            <form className={classes.form} onSubmit={createProductSubmitHandler}>
              <TextField
                fullWidth
                variant="outlined"
                label="Product Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <ShoppingCartOutlinedIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                variant="outlined"
                label="Price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Typography variant="body1" sx={{ color: "text.secondary", fontWeight: 600 }}>
                        Rs.
                      </Typography>
                    </InputAdornment>
                  ),
                }}
              />

              <FormControl fullWidth variant="outlined">
                <Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  displayEmpty
                  required
                >
                  <MenuItem value="" disabled>Choose Category</MenuItem>
                  {categories.map((cate) => (
                    <MenuItem key={cate} value={cate}>
                      {cate.charAt(0).toUpperCase() + cate.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth variant="outlined">
                <Select
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  displayEmpty
                  required
                >
                  <MenuItem value="" disabled>Choose Size</MenuItem>
                  {sizes.map((s) => (
                    <MenuItem key={s} value={s}>{s}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth variant="outlined">
                <Select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  displayEmpty
                  required
                >
                  <MenuItem value="" disabled>Choose Condition</MenuItem>
                  {conditions.map((c) => (
                    <MenuItem key={c} value={c}>{c}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                variant="outlined"
                label="Additional Info"
                value={info}
                onChange={(e) => setInfo(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <InfoIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                variant="outlined"
                label="Product Description"
                multiline
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <DescriptionIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              <Box>
                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                  startIcon={<CollectionsIcon />}
                  className={classes.uploadBtn}
                  sx={{ py: 1.5, borderRadius: "12px", textTransform: "none" }}
                >
                  Upload Product Images
                  <input
                    type="file"
                    hidden
                    multiple
                    accept="image/*"
                    onChange={createProductImagesChange}
                    ref={fileInputRef}
                  />
                </Button>
              </Box>

              <Box className={classes.imagePreviewBox}>
                {imagesPreview.map((img, index) => (
                  <img key={index} src={img} alt="Product Preview" />
                ))}
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                className={classes.submitBtn}
                disabled={loading}
              >
                Create Product
              </Button>
            </form>
          </Paper>
        )}
      </Box>
    </Box>
  );
}

export default NewProduct;
