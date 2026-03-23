import React, { useEffect, useState } from "react";
import { useAlert } from "react-alert";
import { useSelector, useDispatch } from "react-redux";
import MetaData from "../layouts/MataData/MataData";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import { UPDATE_USER_RESET } from "../../constants/userConstanat";
import {
  getUserDetails,
  updateUser,
  clearErrors,
} from "../../actions/userAction";
import Loader from "../layouts/loader/Loader";
import { useHistory, useRouteMatch } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import {
  Avatar,
  Button,
  TextField,
  Typography,
  InputAdornment,
  MenuItem,
  Select,
  Box,
  Paper,
  FormControl,
} from "@mui/material";
import MailOutlineIcon from "@mui/icons-material/MailOutline";

const useStyles = makeStyles((theme) => ({
  dashboard: {
    display: "flex",
    backgroundColor: "#F8F9FB",
    minHeight: "100vh",
  },
  mainContent: {
    flexGrow: 1,
    marginLeft: "280px",
    marginTop: "80px",
    padding: "2rem",
  },
  sectionPaper: {
    padding: "2rem",
    borderRadius: "16px !important",
    border: "none !important",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.01) !important",
    maxWidth: "500px",
    margin: "0 auto",
  },
  sectionTitle: {
    fontSize: "1.5rem !important",
    fontWeight: "800 !important",
    color: "#1a1a1a",
    marginBottom: "2rem !important",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },
  avatar: {
    margin: "0 auto 1rem",
    backgroundColor: "#1a1a1a",
    width: "60px",
    height: "60px",
  },
  textField: {
    "& .MuiOutlinedInput-root": {
      "&:hover fieldset": { borderColor: "#EC4899" },
      "&.Mui-focused fieldset": { borderColor: "#EC4899" },
    },
  },
  loginButton: {
    backgroundColor: "#EC4899 !important",
    color: "#fff !important",
    padding: "0.8rem !important",
    borderRadius: "12px !important",
    fontWeight: "700 !important",
    textTransform: "none !important",
    fontSize: "1rem !important",
    marginTop: "1rem !important",
    "&:hover": {
      backgroundColor: "#DB2777 !important",
    },
  },
  select: {
    width: "100%",
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
    },
  },
}));

function UpdateUser() {
  const dispatch = useDispatch();
  const alert = useAlert();
  const userId = useRouteMatch().params.id;
  const history = useHistory();
  const classes = useStyles();
  const { loading, error, user } = useSelector((state) => state.userDetails);
  const { loading: updateLoading, error: updateError, isUpdated } = useSelector(
    (state) => state.profileData
  );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("Active");
  const [isApproved, setIsApproved] = useState(false);

  useEffect(() => {
    if (user && user._id !== userId) {
      dispatch(getUserDetails(userId));
    } else if (user) {
      setName(user.name);
      setEmail(user.email);
      setRole(user.role);
      setStatus(user.status || "Active");
      setIsApproved(user.isApproved);
    }

    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (updateError) {
      alert.error(updateError);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      alert.success("User Status Updated Successfully");
      history.push("/admin/users");
      dispatch({ type: UPDATE_USER_RESET });
    }
  }, [dispatch, alert, error, history, isUpdated, updateError, user, userId]);

  const updateUserSubmitHandler = (e) => {
    e.preventDefault();
    const userData = {
      name,
      email,
      status,
      isApproved,
    };
    dispatch(updateUser(userId, userData));
  };

  return (
    <Box className={classes.dashboard}>
      <MetaData title="Manage User - Admin" />
      <AdminSidebar />
      <Box className={classes.mainContent}>
        <AdminHeader title="Manage User Status" />
        
        {loading ? (
          <Loader />
        ) : (
          <Paper className={classes.sectionPaper} sx={{ mt: 2 }}>
            <form className={classes.form} onSubmit={updateUserSubmitHandler}>
              <Avatar className={classes.avatar}>
                <AccountCircleIcon style={{ fontSize: 40 }} />
              </Avatar>
              <Typography className={classes.sectionTitle}>Update Status</Typography>

              <TextField
                variant="outlined"
                fullWidth
                label="Name"
                disabled
                value={name}
                className={classes.textField}
              />

              <TextField
                variant="outlined"
                fullWidth
                label="Email"
                disabled
                value={email}
                className={classes.textField}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <MailOutlineIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              <FormControl fullWidth variant="outlined">
                <Typography variant="caption" sx={{ mb: 1, ml: 1, fontWeight: 600, color: "text.secondary" }}>
                  User Status
                </Typography>
                <Select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  variant="outlined"
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Blocked">Blocked</MenuItem>
                </Select>
              </FormControl>

              {role === "vendor" && (
                <FormControl fullWidth variant="outlined">
                  <Typography variant="caption" sx={{ mb: 1, ml: 1, fontWeight: 600, color: "text.secondary" }}>
                    Approval Status (Vendors)
                  </Typography>
                  <Select
                    value={isApproved}
                    onChange={(e) => setIsApproved(e.target.value)}
                    variant="outlined"
                  >
                    <MenuItem value={true}>Approved</MenuItem>
                    <MenuItem value={false}>Pending</MenuItem>
                  </Select>
                </FormControl>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                className={classes.loginButton}
                disabled={updateLoading}
              >
                {updateLoading ? "Updating..." : "Update Status"}
              </Button>
            </form>
          </Paper>
        )}
      </Box>
    </Box>
  );
}

export default UpdateUser;


  