import React from "react";
import { Box, Typography, Button, Paper, Container } from "@mui/material";
import { makeStyles } from "@mui/styles";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import MetaData from "../layouts/MataData/MataData";
import { useDispatch } from "react-redux";
import { logout } from "../../actions/userAction";
import { useAlert } from "react-alert";

import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8F9FB",
  },
  card: {
    padding: "3rem",
    textAlign: "center",
    borderRadius: "20px !important",
    boxShadow: "0 10px 30px rgba(0,0,0,0.05) !important",
    maxWidth: "500px",
  },
  icon: {
    fontSize: "80px !important",
    color: "#F59E0B",
    marginBottom: "1.5rem",
  },
  title: {
    fontWeight: "800 !important",
    fontSize: "1.75rem !important",
    color: "#1a1a1a",
    marginBottom: "1rem !important",
  },
  description: {
    color: "#64748b",
    fontSize: "1.1rem !important",
    lineHeight: "1.6 !important",
    marginBottom: "2rem !important",
  },
  button: {
    backgroundColor: "#000 !important",
    color: "#fff !important",
    padding: "0.75rem 2rem !important",
    borderRadius: "12px !important",
    textTransform: "none !important",
    fontWeight: "700 !important",
    fontSize: "1rem !important",
  },
}));

const PendingApproval = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const alert = useAlert();
  const history = useHistory();

  const handleLogout = async () => {
    const success = await dispatch(logout());
    if (success) {
      alert.success("Logged out successfully");
      history.push("/login");
    }
  };

  return (
    <Box className={classes.root}>
      <MetaData title="Pending Approval - Angels Attic" />
      <Container maxWidth="sm">
        <Paper className={classes.card}>
          <HourglassEmptyIcon className={classes.icon} />
          <Typography className={classes.title}>Account Pending Approval</Typography>
          <Typography className={classes.description}>
            Thank you for registering as a vendor with Angels Attic! Your account is currently 
            under review by our admin team. You will be able to access your dashboard 
            once your application has been approved.
          </Typography>
          <Button 
            variant="contained" 
            className={classes.button}
            onClick={handleLogout}
          >
            Log Out
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default PendingApproval;
