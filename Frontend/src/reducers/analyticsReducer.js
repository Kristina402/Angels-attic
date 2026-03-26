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

export const analyticsReducer = (state = { analytics: {}, reports: [] }, action) => {
  switch (action.type) {
    case GET_VENDOR_ANALYTICS_REQUEST:
    case GET_ADMIN_ANALYTICS_REQUEST:
      return {
        ...state,
        loading: true,
        analytics: {},
      };
    case GET_ADMIN_REPORTS_REQUEST:
      return {
        ...state,
        loading: true,
        reports: [],
      };
    case GET_VENDOR_ANALYTICS_SUCCESS:
    case GET_ADMIN_ANALYTICS_SUCCESS:
      return {
        ...state,
        loading: false,
        analytics: action.payload,
      };
    case GET_ADMIN_REPORTS_SUCCESS:
      return {
        ...state,
        loading: false,
        reports: action.payload,
      };
    case GET_VENDOR_ANALYTICS_FAIL:
    case GET_ADMIN_ANALYTICS_FAIL:
    case GET_ADMIN_REPORTS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};
