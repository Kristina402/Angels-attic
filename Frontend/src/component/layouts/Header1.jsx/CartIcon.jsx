import React from "react";
import { ShoppingCart } from "@material-ui/icons";
import "./CartIcon.css"
const CartIcon = () => {
  return (
    <div className="cartIconWrapper">
      <ShoppingCart className="icon" style={{ fontSize: "28px" }} />
    </div>
  );
};

export default CartIcon;
