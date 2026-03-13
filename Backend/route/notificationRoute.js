const express = require("express");
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  clearAll,
} = require("../controller/notificationController");
const { isAuthentictedUser } = require("../middleWare/auth");

const router = express.Router();

router.route("/notifications").get(isAuthentictedUser, getNotifications);
router.route("/notifications/mark-all-read").put(isAuthentictedUser, markAllAsRead);
router.route("/notifications/clear-all").delete(isAuthentictedUser, clearAll);
router.route("/notifications/:id/mark-as-read").put(isAuthentictedUser, markAsRead);

module.exports = router;
