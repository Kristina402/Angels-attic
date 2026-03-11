import React, { useEffect } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { 
  ExitToApp as LogoutIcon, 
  Person as PersonIcon, 
  Email as EmailIcon, 
  CalendarToday as CalendarIcon,
  Phone as PhoneIcon,
  Wc as GenderIcon,
  Lock as LockIcon,
  ShoppingBasket as OrderIcon,
  Edit as EditIcon,
  VpnKey as PasswordIcon
} from "@material-ui/icons";
import { Link } from "react-router-dom";
import "./Profile.css";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../actions/userAction";
import { useAlert } from "react-alert";
import MetaData from "../layouts/MataData/MataData";

const ProfilePage = () => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const history = useHistory();
  const { user, isAuthenticated } = useSelector((state) => state.userData);

  const logoutHandler = () => {
    dispatch(logout());
    alert.success("Logged out successfully");
    history.push("/login");
  };

  useEffect(() => {
    if (isAuthenticated === false) {
      history.push("/login");
    }
  }, [history, isAuthenticated]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!user) return null;

  return (
    <div className="profile-dashboard-root">
      <MetaData title={`${user.name}'s Profile`} />
      
      <div className="dashboard-container">
        {/* Left Column - Profile Overview */}
        <div className="dashboard-left">
          <div className="profile-overview-card">
            <div className="avatar-wrapper">
              <Avatar
                alt={user.name}
                src={user.avatar?.url}
                className="large-avatar"
              />
              <Link to="/profile/update" className="edit-avatar-btn">
                <EditIcon fontSize="small" />
              </Link>
            </div>
            
            <Typography variant="h5" className="user-name">
              {user.name}
            </Typography>
            <Typography variant="body2" className="user-role">
              {user.role?.toUpperCase() || "CUSTOMER"}
            </Typography>

            <div className="overview-details">
              <div className="detail-item">
                <EmailIcon className="detail-icon" />
                <Typography variant="body2">{user.email}</Typography>
              </div>
              <div className="detail-item">
                <CalendarIcon className="detail-icon" />
                <Typography variant="body2">Member Since: {formatDate(user.createdAt)}</Typography>
              </div>
            </div>
          </div>

          <div className="orders-summary-card">
            <div className="card-header">
              <OrderIcon className="header-icon" />
              <Typography variant="h6">Orders</Typography>
            </div>
            <Typography variant="body2" className="card-desc">
              Manage and track your recent orders easily.
            </Typography>
            <Link to="/orders" className="full-width-link">
              <Button variant="contained" className="primary-dashboard-btn" fullWidth>
                View Orders
              </Button>
            </Link>
          </div>
        </div>

        {/* Right Column - Details & Settings */}
        <div className="dashboard-right">
          {/* Personal Information */}
          <div className="settings-card">
            <div className="settings-header">
              <Typography variant="h6" className="bold-title">Personal Information</Typography>
              <Link to="/profile/update" className="no-decoration">
                <Button startIcon={<EditIcon />} className="text-btn">Edit Details</Button>
              </Link>
            </div>
            
            <div className="settings-content">
              <div className="settings-row">
                <div className="row-label">
                  <PersonIcon className="row-icon" />
                  <Typography variant="body2">Full Name</Typography>
                </div>
                <Typography variant="body1" className="row-value">{user.name}</Typography>
              </div>
              
              <div className="settings-row">
                <div className="row-label">
                  <EmailIcon className="row-icon" />
                  <Typography variant="body2">Email Address</Typography>
                </div>
                <Typography variant="body1" className="row-value">{user.email}</Typography>
              </div>

              <div className="settings-row">
                <div className="row-label">
                  <PhoneIcon className="row-icon" />
                  <Typography variant="body2">Phone Number</Typography>
                </div>
                <Typography variant="body1" className="row-value">{user.phone || "Not Provided"}</Typography>
              </div>

              <div className="settings-row">
                <div className="row-label">
                  <GenderIcon className="row-icon" />
                  <Typography variant="body2">Gender</Typography>
                </div>
                <Typography variant="body1" className="row-value">{user.gender || "Not Specified"}</Typography>
              </div>
            </div>
          </div>

          {/* Login Details */}
          <div className="settings-card">
            <div className="settings-header">
              <Typography variant="h6" className="bold-title">Login Details</Typography>
              <Link to="/password/update" className="no-decoration">
                <Button startIcon={<PasswordIcon />} className="text-btn">Update Password</Button>
              </Link>
            </div>
            
            <div className="settings-content">
              <div className="settings-row">
                <div className="row-label">
                  <EmailIcon className="row-icon" />
                  <Typography variant="body2">Email</Typography>
                </div>
                <Typography variant="body1" className="row-value">{user.email}</Typography>
              </div>
              
              <div className="settings-row">
                <div className="row-label">
                  <LockIcon className="row-icon" />
                  <Typography variant="body2">Password</Typography>
                </div>
                <Typography variant="body1" className="row-value">••••••••••••</Typography>
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="settings-card security-card">
            <div className="settings-header">
              <Typography variant="h6" className="bold-title">Security</Typography>
            </div>
            
            <div className="settings-content">
              <div className="security-info">
                <Typography variant="subtitle1" className="security-title">Log out from all devices</Typography>
                <Typography variant="body2" className="security-desc">
                  This will end all your active sessions on other devices and browsers. You will need to log in again.
                </Typography>
                <Button 
                  variant="contained" 
                  startIcon={<LogoutIcon />} 
                  className="logout-dashboard-btn"
                  onClick={logoutHandler}
                >
                  Logout Account
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
