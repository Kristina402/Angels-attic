import {
  GET_NOTIFICATIONS_REQUEST,
  GET_NOTIFICATIONS_SUCCESS,
  GET_NOTIFICATIONS_FAIL,
  MARK_AS_READ_REQUEST,
  MARK_AS_READ_SUCCESS,
  MARK_AS_READ_FAIL,
  MARK_AS_READ_RESET,
  MARK_ALL_READ_REQUEST,
  MARK_ALL_READ_SUCCESS,
  MARK_ALL_READ_FAIL,
  MARK_ALL_READ_RESET,
  CLEAR_ALL_NOTIFICATIONS_REQUEST,
  CLEAR_ALL_NOTIFICATIONS_SUCCESS,
  CLEAR_ALL_NOTIFICATIONS_FAIL,
  CLEAR_ALL_NOTIFICATIONS_RESET,
  CLEAR_ERRORS,
} from "../constants/notificationConstants";

export const notificationReducer = (state = { notifications: [] }, action) => {
  switch (action.type) {
    case GET_NOTIFICATIONS_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case GET_NOTIFICATIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        notifications: action.payload,
      };
    case GET_NOTIFICATIONS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case MARK_AS_READ_REQUEST:
    case MARK_ALL_READ_REQUEST:
    case CLEAR_ALL_NOTIFICATIONS_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case MARK_AS_READ_SUCCESS:
      return {
        ...state,
        loading: false,
        isUpdated: action.payload,
      };

    case MARK_ALL_READ_SUCCESS:
      return {
        ...state,
        loading: false,
        isAllMarked: action.payload,
      };

    case CLEAR_ALL_NOTIFICATIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        isDeleted: action.payload,
      };

    case MARK_AS_READ_FAIL:
    case MARK_ALL_READ_FAIL:
    case CLEAR_ALL_NOTIFICATIONS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case MARK_AS_READ_RESET:
      return {
        ...state,
        isUpdated: false,
      };

    case MARK_ALL_READ_RESET:
      return {
        ...state,
        isAllMarked: false,
      };

    case CLEAR_ALL_NOTIFICATIONS_RESET:
      return {
        ...state,
        isDeleted: false,
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
