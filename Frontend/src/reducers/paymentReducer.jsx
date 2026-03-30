import {
  ALL_PAYMENTS_REQUEST,
  ALL_PAYMENTS_SUCCESS,
  ALL_PAYMENTS_FAIL,
  VENDOR_PAYMENTS_REQUEST,
  VENDOR_PAYMENTS_SUCCESS,
  VENDOR_PAYMENTS_FAIL,
  CLEAR_ERRORS,
} from "../constants/paymentConstant";

export const paymentReducer = (state = { payments: [] }, action) => {
  switch (action.type) {
    case ALL_PAYMENTS_REQUEST:
    case VENDOR_PAYMENTS_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case ALL_PAYMENTS_SUCCESS:
      return {
        loading: false,
        payments: action.payload.payments,
        totalRevenue: action.payload.totalRevenue,
      };
    case VENDOR_PAYMENTS_SUCCESS:
      return {
        loading: false,
        payments: action.payload.payments,
        vendorRevenue: action.payload.vendorRevenue,
      };
    case ALL_PAYMENTS_FAIL:
    case VENDOR_PAYMENTS_FAIL:
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
