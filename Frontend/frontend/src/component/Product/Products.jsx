import React, { useEffect } from "react";
import "./Products.css";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../layouts/loader/Loader";
import { useAlert } from "react-alert";
import { useRouteMatch } from "react-router-dom";
import MetaData from "../layouts/MataData/MataData";
import { clearErrors, getProduct } from "../../actions/productAction";
import ProductCard from "../Home/ProductCard";
import Pagination from "react-js-pagination";
import Slider from "@mui/material/Slider";
import { Typography } from "@mui/material";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import InventoryIcon from "@mui/icons-material/Inventory";


import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";


import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const categories = [
  "bags",
  "bottoms",
  "footwares",
  "jackets",
  "skirts",
  "tops",
];

const conditions = ["New", "Like New", "Pre-loved"];
const sizes = ["XS", "S", "M", "L", "XL", "XXL", "Free Size"];

function Products() {
  const match = useRouteMatch();
  let keyword = match.params.keyword;
  const dispatch = useDispatch();
  const {
    products,
    loading,
    productsCount,
    error,
    resultPerPage,
  } = useSelector((state) => state.products);
  const alert = useAlert();

  const [currentPage, setCurrentPage] = React.useState(1);
  const [price, setPrice] = React.useState([0, 100000]);
  const [category, setCategory] = React.useState("");
  const [condition, setCondition] = React.useState("");
  const [size, setSize] = React.useState("");
  const [sort, setSort] = React.useState("price");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get("category");
    if (categoryParam) {
      setCategory(categoryParam);
    }
  }, []);

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    dispatch(getProduct(keyword, currentPage, price, category, condition, size, sort));
  }, [dispatch, keyword, currentPage, price, category, condition, size, sort, error, alert]);

  const setCurrentPageNoHandler = (e) => {
    setCurrentPage(e);
  };

  const priceHandler = (event, newPrice) => {
    setPrice(newPrice);
  };

  const clearFiltersHandler = () => {
    setPrice([0, 100000]);
    setCategory("");
    setCondition("");
    setSize("");
    setSort("price");
    setCurrentPage(1);
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <MetaData title="Products" />
          <div className="productPage">
            <div className="prodcutPageTop">
              <div className="filterBox">
                <div className="filter_header">
                  <Typography variant="h6" style={{ fontWeight: 700 }}>Filters</Typography>
                  <Button 
                    variant="text" 
                    color="primary" 
                    onClick={clearFiltersHandler}
                    style={{ textTransform: "none", fontSize: "14px" }}
                  >
                    Clear All
                  </Button>
                </div>

                <div className="filter_divider"></div>

                {/* Sort By */}
                <div className="filterSection">
                  <Typography className="filterTitle">Sort By</Typography>
                  <Select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="filterSelect"
                    IconComponent={ArrowDropDownIcon}
                    fullWidth
                    MenuProps={{
                      classes: { paper: "filterSelectMenu" },
                      anchorOrigin: {
                        vertical: "bottom",
                        horizontal: "left",
                      },
                      transformOrigin: {
                        vertical: "top",
                        horizontal: "left",
                      },
                    }}
                  >
                    <MenuItem value="price">Price: Low to High</MenuItem>
                    <MenuItem value="-price">Price: High to Low</MenuItem>
                  </Select>
                </div>

                <div className="filter_divider"></div>

                {/* Price */}
                <div className="filterSection">
                  <Typography className="filterTitle">Price Range</Typography>
                  <div className="priceSlider">
                    <Slider
                      value={price}
                      onChange={priceHandler}
                      min={0}
                      max={100000}
                      step={100}
                      valueLabelDisplay="auto"
                    />
                  </div>
                  <div className="priceInputGroup">
                    <div className="priceInput">
                      <span>Min</span>
                      <input 
                        type="number" 
                        value={price[0]} 
                        onChange={(e) => setPrice([Number(e.target.value), price[1]])} 
                      />
                    </div>
                    <div className="priceInput">
                      <span>Max</span>
                      <input 
                        type="number" 
                        value={price[1]} 
                        onChange={(e) => setPrice([price[0], Number(e.target.value)])} 
                      />
                    </div>
                  </div>
                </div>

                <div className="filter_divider"></div>

                {/* Categories */}
                <div className="filterSection">
                  <Typography className="filterTitle">Categories</Typography>
                  <ul className="filterList">
                    {categories.map((c) => (
                      <li key={c} className="filterListItem">
                        <FormControlLabel
                          control={
                            <Radio
                              checked={category === c}
                              onChange={() => setCategory(category === c ? "" : c)}
                              onClick={() => category === c && setCategory("")}
                              size="small"
                            />
                          }
                          label={c.charAt(0).toUpperCase() + c.slice(1)}
                        />
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="filter_divider"></div>

                {/* Condition */}
                <div className="filterSection">
                  <Typography className="filterTitle">Condition</Typography>
                  <RadioGroup
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    className="filterList"
                  >
                    {conditions.map((cond) => (
                      <FormControlLabel
                        key={cond}
                        value={cond}
                        control={<Radio size="small" />}
                        label={cond}
                      />
                    ))}
                  </RadioGroup>
                </div>

                <div className="filter_divider"></div>

                {/* Size */}
                <div className="filterSection">
                  <Typography className="filterTitle">Size</Typography>
                  <div className="sizeGrid">
                    {sizes.map((s) => (
                      <button
                        key={s}
                        className={`sizeButton ${size === s ? "active" : ""}`}
                        onClick={() => setSize(size === s ? "" : s)}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="products_container">
                {products === undefined || products.length === 0 ? (
                  <div className="no_products">
                    <InventoryIcon style={{ fontSize: "50px", color: "#ccc" }} />
                    <Typography variant="h6">No Products Found</Typography>
                    <Typography variant="body2" color="textSecondary">
                      Try adjusting your filters or search keywords
                    </Typography>
                  </div>
                ) : (
                  <div className="products">
                    {products &&
                      products.map((product) => (
                        <ProductCard key={product._id} product={product} />
                      ))}
                  </div>
                )}
              </div>
            </div>

            {/* Pagination */}
            {resultPerPage < productsCount && (
              <div className="paginationBox">
                <Pagination
                  activePage={currentPage}
                  itemsCountPerPage={resultPerPage}
                  totalItemsCount={productsCount}
                  onChange={setCurrentPageNoHandler}
                  nextPageText="Next"
                  prevPageText="Prev"
                  firstPageText="First"
                  lastPageText="Last"
                  itemClass="page-item"
                  linkClass="page-link"
                  activeClass="pageItemActive"
                  activeLinkClass="pageLinkActive"
                />
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}

export default Products;
