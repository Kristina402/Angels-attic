import axios from "axios";
import {
  GET_VENDOR_ANALYTICS_REQUEST,
  GET_VENDOR_ANALYTICS_SUCCESS,
  GET_VENDOR_ANALYTICS_FAIL,
  GET_ADMIN_ANALYTICS_REQUEST,
  GET_ADMIN_ANALYTICS_SUCCESS,
  GET_ADMIN_ANALYTICS_FAIL,
  GET_ADMIN_REPORTS_REQUEST,
  GET_ADMIN_REPORTS_SUCCESS,
  GET_ADMIN_REPORTS_FAIL,
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

export const getAdminAnalytics = () => async (dispatch) => {
  try {
    dispatch({ type: GET_ADMIN_ANALYTICS_REQUEST });

    const { data } = await axios.get("/api/v1/admin/analytics");

    dispatch({
      type: GET_ADMIN_ANALYTICS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: GET_ADMIN_ANALYTICS_FAIL,
      payload: error.response.data.message,
    });
  }
};

export const getAdminReports = (startDate = "", endDate = "") => async (dispatch) => {
  try {
    dispatch({ type: GET_ADMIN_REPORTS_REQUEST });

    let link = `/api/v1/admin/reports`;
    if (startDate && endDate) {
      link = `/api/v1/admin/reports?startDate=${startDate}&endDate=${endDate}`;
    }

    const { data } = await axios.get(link);

    dispatch({
      type: GET_ADMIN_REPORTS_SUCCESS,
      payload: data.reports,
    });
  } catch (error) {
    dispatch({
      type: GET_ADMIN_REPORTS_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Clearing Errors
export const clearErrors = () => async (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
