import axios from "axios";
import {
  GET_NOTIFICATIONS_REQUEST,
  GET_NOTIFICATIONS_SUCCESS,
  GET_NOTIFICATIONS_FAIL,
  MARK_AS_READ_REQUEST,
  MARK_AS_READ_SUCCESS,
  MARK_AS_READ_FAIL,
  MARK_ALL_READ_REQUEST,
  MARK_ALL_READ_SUCCESS,
  MARK_ALL_READ_FAIL,
  CLEAR_ALL_NOTIFICATIONS_REQUEST,
  CLEAR_ALL_NOTIFICATIONS_SUCCESS,
  CLEAR_ALL_NOTIFICATIONS_FAIL,
  CLEAR_ERRORS,
} from "../constants/notificationConstants";

// Get all notifications
export const getNotifications = () => async (dispatch) => {
  try {
    dispatch({ type: GET_NOTIFICATIONS_REQUEST });

    const { data } = await axios.get("/api/v1/notifications");

    dispatch({
      type: GET_NOTIFICATIONS_SUCCESS,
      payload: data.notifications,
    });
  } catch (error) {
    dispatch({
      type: GET_NOTIFICATIONS_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Mark a notification as read
export const markNotificationAsRead = (id) => async (dispatch) => {
  try {
    dispatch({ type: MARK_AS_READ_REQUEST });

    const { data } = await axios.put(`/api/v1/notifications/${id}/mark-as-read`);

    dispatch({
      type: MARK_AS_READ_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: MARK_AS_READ_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Mark all notifications as read
export const markAllNotificationsRead = () => async (dispatch) => {
  try {
    dispatch({ type: MARK_ALL_READ_REQUEST });

    const { data } = await axios.put("/api/v1/notifications/mark-all-read");

    dispatch({
      type: MARK_ALL_READ_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: MARK_ALL_READ_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Clear all notifications
export const clearAllNotifications = () => async (dispatch) => {
  try {
    dispatch({ type: CLEAR_ALL_NOTIFICATIONS_REQUEST });

    const { data } = await axios.delete("/api/v1/notifications/clear-all");

    dispatch({
      type: CLEAR_ALL_NOTIFICATIONS_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: CLEAR_ALL_NOTIFICATIONS_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Clearing errors
export const clearErrors = () => async (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
