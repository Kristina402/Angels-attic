import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import MetaData from "../layouts/MataData/MataData";
import Loader from "../layouts/loader/Loader";
import VendorSidebar from "./VendorSidebar";
import VendorHeader from "./VendorHeader";
import { updateProduct, clearErrors, getProductDetails } from "../../actions/productAction";
import { useHistory, useRouteMatch } from "react-router-dom";
import { UPDATE_PRODUCT_RESET } from "../../constants/productsConstatns";
import { Avatar, TextField, Typography, Button, Container, Grid, FormControl, Paper, Select, MenuItem, InputAdornment, Box } from "@material-ui/core";
import { makeStyles } from "@mui/styles";
import ShoppingCartOutlinedIcon from "@material-ui/icons/ShoppingCartOutlined";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import CollectionsIcon from "@mui/icons-material/Collections";
import InfoIcon from "@mui/icons-material/Info";

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
}));

function UpdateProduct() {
  const dispatch = useDispatch();
  const history = useHistory();
  const alert = useAlert();
  const customClasses = useStyles();
  const match = useRouteMatch();
  const productId = match.params.id;

  const { error, product } = useSelector((state) => state.productDetails);
  const { loading, error: updateError, isUpdated } = useSelector((state) => state.deleteUpdateProduct);
  
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [size, setSize] = useState("");
  const [condition, setCondition] = useState("Pre-loved");
  const [availabilityStatus, setAvailabilityStatus] = useState("Available");
  const [info, setInfo] = useState("");
  const [images, setImages] = useState([]);
  const [oldImages, setOldImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);
  const fileInputRef = useRef();

  const categories = ["bags", "bottoms", "footwares", "jackets", "skirts", "tops"];
  const sizes = ["XS", "S", "M", "L", "XL", "XXL", "Free Size"];
  const conditions = ["New", "Like New", "Pre-loved"];
  const statuses = ["Available", "Sold"];

  useEffect(() => {
    if (product && product._id !== productId) {
      dispatch(getProductDetails(productId));
    } else if (product) {
      setName(product.name);
      setDescription(product.description);
      setPrice(product.price);
      setCategory(product.category);
      setInfo(product.info || "");
      setSize(product.size || "");
      setCondition(product.condition || "Pre-loved");
      setAvailabilityStatus(product.availabilityStatus || "Available");
      setOldImages(product.images);
    }

    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (updateError) {
      alert.error(updateError);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      alert.success("Product Updated Successfully");
      history.push("/vendor/products");
      dispatch({ type: UPDATE_PRODUCT_RESET });
    }
  }, [dispatch, alert, error, history, isUpdated, productId, product, updateError]);

  const updateProductSubmitHandler = (e) => {
    e.preventDefault();

    if (name.trim().length === 0) {
      alert.error("Please Enter Product Name");
      return;
    }

    if (price <= 0) {
      alert.error("Price must be greater than 0.");
      return;
    }

    if (description.trim().length < 10) {
      alert.error("Description must be at least 10 characters");
      return;
    }

    const myForm = new FormData();
    myForm.set("name", name);
    myForm.set("price", price);
    myForm.set("description", description);
    myForm.set("category", category);
    myForm.set("size", size);
    myForm.set("condition", condition);
    myForm.set("availabilityStatus", availabilityStatus);
    myForm.set("info", info);
    
    images.forEach((currImg) => {
      myForm.append("images", currImg);
    });

    dispatch(updateProduct(productId, myForm));
  };

  const updateProductImagesChange = (e) => {
    const files = Array.from(e.target.files);
    const allowedExtensions = ["image/jpeg", "image/jpg", "image/png"];

    setImages([]);
    setImagesPreview([]);
    setOldImages([]);

    files.forEach((file) => {
      if (!allowedExtensions.includes(file.type)) {
        alert.error("Only JPG, JPEG, and PNG formats are allowed");
        return;
      }

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
    <Box className={customClasses.dashboard}>
      <MetaData title="Update Product - Vendor" />
      <VendorSidebar />
      <Box className={customClasses.mainContent}>
        <VendorHeader title="Update Product" />
        
        {loading ? (
          <Loader />
        ) : (
          <Paper className={customClasses.sectionPaper}>
            <Typography className={customClasses.sectionTitle}>Edit Thrift Item</Typography>
            
            <form className={customClasses.form} onSubmit={updateProductSubmitHandler}>
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

              <FormControl fullWidth variant="outlined">
                <Select
                  value={availabilityStatus}
                  onChange={(e) => setAvailabilityStatus(e.target.value)}
                  displayEmpty
                  required
                >
                  <MenuItem value="" disabled>Availability Status</MenuItem>
                  {statuses.map((s) => (
                    <MenuItem key={s} value={s}>{s}</MenuItem>
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
              />

              <Box>
                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                  startIcon={<CollectionsIcon />}
                  sx={{ py: 1.5, borderRadius: "12px", textTransform: "none" }}
                >
                  Update Product Images
                  <input
                    type="file"
                    hidden
                    multiple
                    accept="image/*"
                    onChange={updateProductImagesChange}
                    ref={fileInputRef}
                  />
                </Button>
              </Box>

              <Box className={customClasses.imagePreviewBox}>
                {oldImages && oldImages.map((img, index) => (
                  <img key={index} src={img.url} alt="Old Product Preview" />
                ))}
              </Box>

              <Box className={customClasses.imagePreviewBox}>
                {imagesPreview.map((img, index) => (
                  <img key={index} src={img} alt="Product Preview" />
                ))}
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                className={customClasses.submitBtn}
                disabled={loading}
              >
                Update Thrift Item
              </Button>
            </form>
          </Paper>
        )}
      </Box>
    </Box>
  );
}

export default UpdateProduct;
