import axios from "axios";
import {
  GET_VENDOR_ANALYTICS_REQUEST,
  GET_VENDOR_ANALYTICS_SUCCESS,
  GET_VENDOR_ANALYTICS_FAIL,
  CLEAR_ERRORS,
} from "../constants/analyticsConstant";

export const getVendorAnalytics = () => async (dispatch) => {
  try {
    dispatch({ type: GET_VENDOR_ANALYTICS_REQUEST });

    const { data } = await axios.get("/api/v1/vendor/analytics");

    dispatch({
      type: GET_VENDOR_ANALYTICS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: GET_VENDOR_ANALYTICS_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Clearing Errors
export const clearErrors = () => async (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
