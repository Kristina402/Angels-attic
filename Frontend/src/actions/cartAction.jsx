import {
  ADD_TO_CART,
  REMOVE_CART_ITEM,
  SAVE_SHIPPING_INFO,
} from "../constants/cartConstant";
import axios from "axios";

// Helper: get the localStorage key for this user's cart
const getCartKey = (userId) => `cart_${userId}`;

// Add to Cart
export const addItemToCart = (id, quantity = 1) => async (dispatch, getState) => {
  const { data } = await axios.get(`/api/v1/product/${id}`);
  
  // Enforce single quantity for all products
  const finalQuantity = 1;

  dispatch({
    type: ADD_TO_CART,
    payload: {
      productId: data.product._id,
      name: data.product.name,
      price: data.product.price,
      discount: data.product.discount || 0,
      image: data.product.images && data.product.images.length > 0 ? data.product.images[0].url : "/placeholder.png",
      stock: data.product.availabilityStatus === "Available" ? 1 : 0,
      vendorName: data.product.user?.name || "N/A",
      vendorId: data.product.user?._id || data.product.user,
      quantity: finalQuantity,
    },
  });

  // Save to user-specific localStorage key
  const userId = getState().userData.user?._id;
  if (userId) {
    localStorage.setItem(getCartKey(userId), JSON.stringify(getState().cart.cartItems));
  }
};

// Remove item from Cart
export const removeItemFromCart = (id) => async (dispatch, getState) => {
  dispatch({ type: REMOVE_CART_ITEM, payload: id });

  const userId = getState().userData.user?._id;
  if (userId) {
    localStorage.setItem(getCartKey(userId), JSON.stringify(getState().cart.cartItems));
  }
};

// Save Shipping Info
export const saveShippingInfo = (data) => async (dispatch, getState) => {
  dispatch({
    type: SAVE_SHIPPING_INFO,
    payload: data,
  });

  const userId = getState().userData.user?._id;
  if (userId) {
    localStorage.setItem(`shippingInfo_${userId}`, JSON.stringify(data));
  }
};

// Load cart for a specific user from localStorage (called after login/load)
export const loadUserCart = (userId) => (dispatch) => {
  const cartKey = getCartKey(userId);
  const saved = localStorage.getItem(cartKey);
  if (saved) {
    const cartItems = JSON.parse(saved);
    cartItems.forEach((item) => {
      dispatch({ type: ADD_TO_CART, payload: item });
    });
  }
  const shippingKey = `shippingInfo_${userId}`;
  const savedShipping = localStorage.getItem(shippingKey);
  if (savedShipping) {
    dispatch({ type: SAVE_SHIPPING_INFO, payload: JSON.parse(savedShipping) });
  }
};

