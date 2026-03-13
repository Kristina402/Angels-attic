import {
  GET_VENDOR_ANALYTICS_REQUEST,
  GET_VENDOR_ANALYTICS_SUCCESS,
  GET_VENDOR_ANALYTICS_FAIL,
  CLEAR_ERRORS,
} from "../constants/analyticsConstant";

export const analyticsReducer = (state = { analytics: {} }, action) => {
  switch (action.type) {
    case GET_VENDOR_ANALYTICS_REQUEST:
      return {
        loading: true,
        analytics: {},
      };
    case GET_VENDOR_ANALYTICS_SUCCESS:
      return {
        loading: false,
        analytics: action.payload,
      };
    case GET_VENDOR_ANALYTICS_FAIL:
      return {
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
