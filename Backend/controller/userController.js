const ErrorHandler = require("../utils/errorHandler");
const asyncWrapper = require("../middleware/asyncWrapper");
const userModel = require("../models/userModel");
const Notification = require("../models/notificationModel");
const sendJWtToken = require("../utils/JwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const cloudinary = require("cloudinary");

// signUp controller>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
exports.registerUser = asyncWrapper(async (req, res) => {
  const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
    folder: "Avatar", // this folder cloudainry data base manage by us
    width: 150,
    crop: "scale",
  });

  const { name, email, password } = req.body;
  const user = await userModel.create({
    name,
    password,
    email,
    avatar: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    },
  });

  // sending the res and staus code along with token using sendJWtToken method
  sendJWtToken(user, 201, res);
});

// Vendor Registration Controller
exports.registerVendor = asyncWrapper(async (req, res, next) => {
  const { name, email, password, phone, storeName, address } = req.body;

  // Set default avatar for vendor
  const avatarData = {
    public_id: "Avatar/default_avatar",
    url: "https://res.cloudinary.com/dtzzoaiyt/image/upload/v1/Avatar/default_avatar",
  };

  const user = await userModel.create({
    name,
    email,
    password,
    phone,
    storeName,
    address,
    role: "vendor",
    isApproved: true, // Vendors are now auto-approved with basic verification
    avatar: {
      public_id: avatarData.public_id,
      url: avatarData.url,
    },
  });

  // Create notification for admin
  const admins = await userModel.find({ role: "admin" });
  for (const admin of admins) {
    await Notification.create({
      recipient: admin._id,
      message: `New vendor registered: ${storeName}`,
      type: "new_vendor",
      link: `/admin/user/${user._id}`,
    });
  }

  sendJWtToken(user, 201, res);
});

// Login User >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
exports.loginUser = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;

  // checking if user has given password and email both
  if (!email || !password) {
    return next(new ErrorHandler(`Please Enter Email & Password. ${!email ? 'Email missing. ' : ''}${!password ? 'Password missing.' : ''}`, 400));
  }
  const user = await userModel.findOne({ email }).select("+password"); // .select("+password") because in schema we set set select : false so password is'nt return to anyone so we add +password here for verfication of pass

  // jab user nhi mila data base main given credentials ke sath tab
  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  // comparePassword method defind in useSchema by use . it will comapre this password to hashfrom password at database
  const isPasswordMatched = await user.comparePassword(password);

  // when password not mathced with original hashed password
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  sendJWtToken(user, 200, res);
});

// logOut Controller =>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

exports.logoutUser = asyncWrapper(async (req, res) => {
  // delete token for logingOut user =>
  res.cookie("token", null, {
    // curr Token has null value
    expires: new Date(Date.now()), // expires curent
    httpOnly: true,
    path: "/", // Ensure it's cleared for all paths
  });

  res.status(200).json({
    success: true,
    message: "User logged out",
  });
});
//// Forgot Password >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
exports.forgotPassword = asyncWrapper(async (req, res, next) => {
  const user = await userModel.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // Get Reset OTP
  const otp = user.getResetPasswordOTP();

  await user.save({ validateBeforeSave: false });

  const message = `Your password reset verification code is :- \n\n ${otp} \n\nThis code is valid for 3 minutes. If you have not requested this email, please ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Angels Attic Password Recovery`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `OTP sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordOTP = undefined;
    user.resetPasswordOTPExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
});

// Verify OTP Controller
exports.verifyOTP = asyncWrapper(async (req, res, next) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return next(new ErrorHandler("Please enter email and OTP", 400));
  }

  const hashedOTP = crypto
    .createHash("sha256")
    .update(otp)
    .digest("hex");

  const user = await userModel.findOne({
    email,
    resetPasswordOTP: hashedOTP,
  });

  if (!user) {
    return next(new ErrorHandler("Invalid OTP", 400));
  }

  if (user.resetPasswordOTPExpire < Date.now()) {
    return next(new ErrorHandler("OTP has expired", 400));
  }

  res.status(200).json({
    success: true,
    message: "OTP verified successfully",
  });
});

//>>>>>>>>>>>>>>> reset and update password :
exports.resetPassword = asyncWrapper(async (req, res, next) => {
  const { email, otp, password, confirmPassword } = req.body;

  if (!email || !otp || !password || !confirmPassword) {
    return next(new ErrorHandler("Please provide all required fields", 400));
  }

  const hashedOTP = crypto
    .createHash("sha256")
    .update(otp)
    .digest("hex");

  const user = await userModel.findOne({
    email,
    resetPasswordOTP: hashedOTP,
  });

  if (!user) {
    return next(new ErrorHandler("Invalid OTP", 400));
  }

  if (user.resetPasswordOTPExpire < Date.now()) {
    return next(new ErrorHandler("OTP has expired", 400));
  }

  if (password !== confirmPassword) {
    return next(
      new ErrorHandler("Passwords do not match", 400)
    );
  }

  user.password = password;
  user.resetPasswordOTP = undefined;
  user.resetPasswordOTPExpire = undefined;

  await user.save();
  sendJWtToken(user, 200, res);
});

//// Get User Detail  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
exports.getUserDetails = asyncWrapper(async (req, res) => {

  const user = await userModel.findById(req.user.id); // user.id because we set that user into as user.req when user gose autentiction. becauae all data of users set into req.user. only user when logged in then access this function
  res.status(200).json({
    success: true,
    user, // profile details of user
  });
});

// update User password>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
exports.updatePassword = asyncWrapper(async (req, res, next) => {
  const user = await userModel.findById(req.user.id).select("+password"); // + password because pass not allowed in shcema to acsess
   
  const isPasswordMatched = await user.comparePassword(req.body.oldPassword); // user.comparePassword this method define in user Schema  for comapre given normal pass to savde hash pass
  // when user not found
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old password is incorrect", 400));
  }
  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler("password does not match", 400));
  }
  // now set the new pass
  user.password = req.body.newPassword;
  await user.save();
  // now send new token to user . becasue user loggedin with new pass
  sendJWtToken(user, 200, res);
});

//>>>>>> Update user Profile>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
exports.updateProfile = asyncWrapper(async (req, res, next) => {
  // object with user new data
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    gender: req.body.gender,
    storeName: req.body.storeName,
    storeDescription: req.body.storeDescription,
  };

  // if avatar not empty then
  if (req.body.avatar !== "") {
    const user = await userModel.findById(req.user.id);
    const imageId = user.avatar.public_id;

    //  await cloudinary.v2.uploader.destroy(imageId); // delete old Image from cloudnairy
    await cloudinary.v2.uploader.destroy(imageId);

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "Avatar", // this folder cloudainry data base manage by us
      width: 150,
      crop: "scale",
    });

    newUserData.avatar = {
      public_id: myCloud.public_id, // id for img
      url: myCloud.secure_url, // new User data
    };
  }

  // set new value of user
  const user = await userModel.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    user,
  });
});

//>> Get single user (admin) Access only>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
exports.getSingleUser = asyncWrapper(async (req, res, next) => {
  const user = await userModel.findById(req.params.id);
  // if user not found with that id
  if (!user) {
    return next(
      new ErrorHandler(`User does not exist with Id: ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    user,
  });
});

//>>>> update User Role -- Admin {may admin can change any user to admin}>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
exports.updateUserRole = asyncWrapper(async (req, res, next) => {
  // admin should NOT be able to change a user into vendor or admin
  // Only allow admin to manage user status: Active, Blocked
  const newUserData = {};

  if (req.body.name) newUserData.name = req.body.name;
  if (req.body.email) newUserData.email = req.body.email;
  if (req.body.status) newUserData.status = req.body.status;
  if (req.body.isApproved !== undefined) newUserData.isApproved = req.body.isApproved;

  const oldUser = await userModel.findById(req.params.id);
  const user = await userModel.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  // If approval status changed, notify the user
  if (req.user.role === "admin" && oldUser.isApproved !== user.isApproved) {
    await Notification.create({
      recipient: user._id,
      message: `Your vendor registration for "${user.storeName}" has been ${user.isApproved ? "approved" : "disapproved"} by an admin.`,
      type: "vendor_approval",
      link: `/vendor/dashboard`,
    });
  }

  res.status(200).json({
    success: true,
  });
});

// delete user --Admin(only admin can delete user)>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

exports.deleteUser = asyncWrapper(async (req, res, next) => {
  const user = await userModel.findById(req.params.id);
  // when no user found with that id
  if (!user) {
    return next(
      new ErrorHandler(`User does not exist with Id: ${req.params.id}`, 400)
    );
  }

  // delete iamge from cloud as well
  const imageId = user.avatar.public_id;
  await cloudinary.v2.uploader.destroy(imageId);

  // if user founded the just remove from database
  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: "User Deleted Successfully",
  });
});

// getAll user Admin>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
exports.getAllUser = asyncWrapper(async (req, res, next) => {
  const users = await userModel.find();

  res.status(200).json({
    success: true,
    users: users,
  });
});
