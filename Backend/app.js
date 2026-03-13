const express = require("express");
const app = express();
const errorMiddleware = require("./middleWare/error");
const requestLogger = require("./middleWare/requestLogger");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload"); // used for image and other files
const path = require("path");
const cors = require("cors");
require("dotenv").config({ path: "./config/config.env" });







// routes

const user = require("./route/userRoute");
const product = require("./route/productRoute");
const order = require("./route/orderRoute");
const health = require("./route/healthRoute");
const analytics = require("./route/analyticsRoute");
const notification = require("./route/notificationRoute");

// Add request logging middleware
app.use(requestLogger);

// for req.cookie to get token while authentication
app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(fileUpload());
app.use(cors());


app.use("/api/v1", user);
app.use("/api/v1", product);
app.use("/api/v1", order);
app.use("/api/v1", health);
app.use("/api/v1", analytics);
app.use("/api/v1", notification);

// Error middleware must come after all routes
app.use(errorMiddleware);






module.exports = app;
