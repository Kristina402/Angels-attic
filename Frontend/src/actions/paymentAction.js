import {
  ALL_PAYMENTS_REQUEST,
  ALL_PAYMENTS_SUCCESS,
  ALL_PAYMENTS_FAIL,
  VENDOR_PAYMENTS_REQUEST,
  VENDOR_PAYMENTS_SUCCESS,
  VENDOR_PAYMENTS_FAIL,
  CLEAR_ERRORS,
} from "../constants/paymentConstant";
import axios from "axios";

// Get all payments -- Admin
export const getAllPayments = () => async (dispatch) => {
  try {
    dispatch({ type: ALL_PAYMENTS_REQUEST });

    const { data } = await axios.get("/api/v1/admin/payments");

    dispatch({
      type: ALL_PAYMENTS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ALL_PAYMENTS_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Get vendor-specific payments -- Vendor
export const getVendorPayments = () => async (dispatch) => {
  try {
    dispatch({ type: VENDOR_PAYMENTS_REQUEST });

    const { data } = await axios.get("/api/v1/vendor/payments");

    dispatch({
      type: VENDOR_PAYMENTS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: VENDOR_PAYMENTS_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Clear Errors
export const clearErrors = () => async (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
