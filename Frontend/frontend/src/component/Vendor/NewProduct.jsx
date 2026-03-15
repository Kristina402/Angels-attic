import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import MetaData from "../layouts/MataData/MataData";
import Loader from "../layouts/loader/Loader";
import VendorSidebar from "./VendorSidebar";
import VendorHeader from "./VendorHeader";
import { createProduct, clearErrors } from "../../actions/productAction";
import { useHistory } from "react-router-dom";
import { NEW_PRODUCT_RESET } from "../../constants/productsConstatns";
import InputAdornment from "@material-ui/core/InputAdornment";
import Box from "@material-ui/core/Box";
import DescriptionIcon from "@material-ui/icons/Description";
import StorageIcon from "@material-ui/icons/Storage";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import CollectionsIcon from "@mui/icons-material/Collections";
import ShoppingCartOutlinedIcon from "@material-ui/icons/ShoppingCartOutlined";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InfoIcon from "@mui/icons-material/Info";
import { Avatar, TextField, Typography, Button, Container, Grid, FormControl, Paper } from "@material-ui/core";
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

function NewProduct() {
  const dispatch = useDispatch();
  const history = useHistory();
  const alert = useAlert();
  const customClasses = useStyles();

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
      history.push("/vendor/dashboard");
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

  if (loading) return <Loader />;

  return (
    <Box className={customClasses.dashboard}>
      <MetaData title={"Add Product - Vendor"} />
      <VendorSidebar />
      <Box className={customClasses.mainContent}>
        <VendorHeader title="Add New Product" />
        
        <Paper className={customClasses.sectionPaper} sx={{ mt: 2 }}>
          <Typography className={customClasses.sectionTitle}>Product Details</Typography>
          
          <form className={customClasses.form} onSubmit={createProductSubmitHandler}>
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

            <TextField
              fullWidth
              variant="outlined"
              label="Description"
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

            <Box>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="product-images"
                multiple
                type="file"
                onChange={createProductImagesChange}
                ref={fileInputRef}
              />
              <label htmlFor="product-images">
                <Button
                  variant="outlined"
                  component="span"
                  fullWidth
                  startIcon={<CloudUploadIcon />}
                  sx={{ py: 1.5, borderRadius: '12px', borderColor: '#e2e8f0', color: '#64748b' }}
                >
                  Upload Product Images
                </Button>
              </label>
            </Box>

            {imagesPreview.length > 0 && (
              <Box className={customClasses.imagePreviewBox}>
                {imagesPreview.map((image, index) => (
                  <img key={index} src={image} alt="Product Preview" />
                ))}
              </Box>
            )}

            <Button
              type="submit"
              variant="contained"
              fullWidth
              className={customClasses.submitBtn}
              disabled={loading}
            >
              Create Product
            </Button>
          </form>
        </Paper>
      </Box>
    </Box>
  );
}

export default NewProduct;
