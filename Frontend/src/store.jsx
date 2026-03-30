import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import {
  productsReducer,
  productDetailsReducer,
  newReviewReducer,
  newProductReducer,
  deleteUpdateReducer,
   getALLReviewReducer,
   deleteReviewReducer
} from "./reducers/productReducers";
import {
  profileReducer,
  userReducer,
  forgetPasswordReducer,
  userDetailsReducer,
  allUsersReducer,
  vendorReducer,
} from "./reducers/userReducer";

import { cartReducer } from "./reducers/cartReducer";
import { wishlistReducer } from "./reducers/wishlistReducer";
import {
  newOrderReducer,
  myOrderReducer,
  orderDetialsReducer,
  allOrdersReducer,
  deletUpdateOrderReducer,
  

} from "./reducers/orderReducer";
import { analyticsReducer } from "./reducers/analyticsReducer";
import { notificationReducer } from "./reducers/notificationReducer";
import { paymentReducer } from "./reducers/paymentReducer";


const rootReducer = combineReducers({
  products: productsReducer,
  productDetails: productDetailsReducer,
  userData: userReducer,
  profileData: profileReducer,
  forgetPassword: forgetPasswordReducer,
  cart: cartReducer,
  newOrder: newOrderReducer,
  myOrder: myOrderReducer,
  orderDetails: orderDetialsReducer,
  addNewReview: newReviewReducer,
  addNewProduct: newProductReducer,
  deleteUpdateProduct: deleteUpdateReducer,
  allOrders: allOrdersReducer,
  deleteUpdateOrder: deletUpdateOrderReducer,
  allUsers: allUsersReducer,
  userDetails: userDetailsReducer,
  deleteReview :deleteReviewReducer,
  getAllReview : getALLReviewReducer,
  wishlist: wishlistReducer,
  vendor: vendorReducer,
  analytics: analyticsReducer,
  notifications: notificationReducer,
  payment: paymentReducer,
});

// Cart is now user-specific and loaded dynamically after login via loadUserCart()
// Remove legacy shared cart keys from previous implementation
localStorage.removeItem("cartItem");
localStorage.removeItem("shippingInfo");

let initialState = {
  wishlist: {
    wishlistItems: localStorage.getItem("wishlistItems")
      ? JSON.parse(localStorage.getItem("wishlistItems"))
      : [],
  },
};


const middleware = [thunk];

const store = createStore(
  rootReducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
