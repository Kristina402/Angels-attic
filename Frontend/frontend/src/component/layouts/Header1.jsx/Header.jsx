import React, { useState } from "react";
import ReorderIcon from "@mui/icons-material/Reorder";
import SearchBar from "./Searchbar";
import "./Header.css";

import CartIcon from "./CartIcon";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useSelector } from "react-redux";

import ProfileModal from "./ProfileModel";

function Header() {
  const history = useHistory();
  const { isAuthenticated, user } = useSelector((state) => state.userData);

  const [searchBarActive, setSearchBarActive] = useState(true);
  const [sideMenu, setSideMenu] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  // this is for handle sideBar
  const handleSideBarMenu = () => {
    setSideMenu(!sideMenu);
  };

  // this keeps the search bar visible and active
  const handleSearchButtonClick = () => {
    setSearchBarActive(true);
  };

  // this is for input value of Search bar.
  const handleSearchInputChange = (event) => {
    setSearchValue(event.target.value);
  };

  // this is for handle searching ...
  const handleSearchFormSubmit = (event) => {
    event.preventDefault();
    if (searchValue.trim()) {
      history.push(`/products/${searchValue}`);
    } else {
      history.push("/products");
    }
  };

  // this is for sideBar Toggle Button
  const handleCrossButtonClick = () => {
    setSearchValue("");
    setSearchBarActive(true);
  };

  return (
    <>
      <div className="header">
        <div className="headerTop">
          <div className="headerTopLeft"></div>
          <div className="headerTopRight">
            <div className="headerLogin">
              {isAuthenticated && (
                <Link
                  to="/account"
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  <button>My Account</button>
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="headerBottom">
          <div className="headerBottom_left">
            <button
              className="header_mobile_toggle"
              onClick={() => setSideMenu(!sideMenu)}
            >
              <ReorderIcon />
            </button>
            {sideMenu && (
              <Sidebar
                handleSideBarMenu={handleSideBarMenu}
                isAuthenticated={isAuthenticated}
                user={user}
              />
            )}
            <Link to="/" className="brand">
              <img
                src={require("../../../Image/logo.png")}
                alt="Angels Attic logo"
                className="brand_logo"
              />
            </Link>
          </div>

          <div className="headerBottom_center">
            <SearchBar
              searchBarActive={searchBarActive}
              searchValue={searchValue}
              handleCrossButtonClick={handleCrossButtonClick}
              handleSearchButtonClick={handleSearchButtonClick}
              handleSearchInputChange={handleSearchInputChange}
              handleSearchFormSubmit={handleSearchFormSubmit}
            />
          </div>

          <div className="headerBottom_right">
            <nav className="main_nav">
              <ul>
                <li>
                  <Link to="/products">Shop</Link>
                </li>
                <li>
                  <Link to="/about">About</Link>
                </li>
                <li>
                  <Link to="/contact">Contact</Link>
                </li>
                <li>
                  <Link to={isAuthenticated ? "/account" : "/signup"}>
                    {isAuthenticated ? "Account" : "Sign Up"}
                  </Link>
                </li>
              </ul>
            </nav>
            <Link
              to="/wishlist"
              className="icon_button"
              style={{ color: "inherit", textDecoration: "none" }}
            >
              <FavoriteIcon style={{ fontSize: "32px" }} />
            </Link>
            <Link
              to="/cart"
              className="icon_button"
              style={{ color: "inherit", textDecoration: "none" }}
            >
              <CartIcon />
            </Link>
            <ProfileModal user={user} isAuthenticated={isAuthenticated} />
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
