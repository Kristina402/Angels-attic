const Notification = require("../models/notificationModel");
const asyncWrapper = require("../middleWare/asyncWrapper");
const ErrorHandler = require("../utils/errorHandler");

// Get all notifications for a user
exports.getNotifications = asyncWrapper(async (req, res, next) => {
  const notifications = await Notification.find({ recipient: req.user._id }).sort({
    createdAt: -1,
  });

  res.status(200).json({
    success: true,
    notifications,
  });
});

// Mark a notification as read
exports.markAsRead = asyncWrapper(async (req, res, next) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    return next(new ErrorHandler("Notification not found", 404));
  }

  notification.read = true;
  await notification.save();

  res.status(200).json({
    success: true,
  });
});

// Mark all notifications as read
exports.markAllAsRead = asyncWrapper(async (req, res, next) => {
  await Notification.updateMany({ recipient: req.user._id }, { read: true });

  res.status(200).json({
    success: true,
  });
});

// Clear all notifications for a user
exports.clearAll = asyncWrapper(async (req, res, next) => {
  await Notification.deleteMany({ recipient: req.user._id });

  res.status(200).json({
    success: true,
  });
});
