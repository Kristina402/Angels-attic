import React, { useState, useEffect } from "react";

import { makeStyles } from "@material-ui/core/styles";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import { 
  Typography, 
  Button, 
  Box, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions 
} from "@material-ui/core";
import { Link, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { CREATE_ORDER_RESET } from "../../constants/orderConstant";

const useStyles = makeStyles((theme) => ({
  orderSuccess: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    padding: "9rem",
    backgroundColor: theme.palette.common.white,
    [theme.breakpoints.down("sm")]: {
      padding: "4rem 2rem",
    },
  },
  successIcon: {
    fontSize: "8rem",
    color: theme.palette.success.main,
    marginBottom: theme.spacing(4),
  },
  successText: {
    marginBottom: theme.spacing(2),
    fontWeight: "bold",
    fontSize: "2rem",
    color: theme.palette.text.primary,
  },
  orderIdText: {
    marginBottom: theme.spacing(4),
    color: theme.palette.text.secondary,
    backgroundColor: "#f9f9f9",
    padding: "1rem 2rem",
    borderRadius: "12px",
    border: "1px dashed #ccc",
    fontFamily: "monospace",
    fontSize: "1.1rem",
  },
  link: {
    textDecoration: "none",
  },
  viewOrdersButton: {
    marginTop: theme.spacing(4),
    padding: theme.spacing(2, 4),
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    borderRadius: theme.spacing(4),
    textTransform: "uppercase",
    letterSpacing: 2,
    fontWeight: "bold",
    transition: "background-color 0.3s ease",
    "&:hover": {
      backgroundColor: "#ed1c24",
    },
  },
  popupTitle: {
    textAlign: "center",
    fontWeight: 800,
    color: "#2e7d32",
  },
  popupContent: {
    textAlign: "center",
    padding: "2rem",
  },
  popupOrderId: {
    fontWeight: 700,
    marginTop: "1rem",
    color: "#EC4899",
    fontSize: "1.2rem",
  }
}));

function OrderSuccess() {
  const classes = useStyles();
  const location = useLocation();
  const dispatch = useDispatch();
  const queryParams = new URLSearchParams(location.search);
  const orderId = queryParams.get("id");
  const totalAmount = queryParams.get("total");
  const status = queryParams.get("status");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (orderId) {
      setOpen(true);
    }
    // Reset order state so user can place new order later
    dispatch({ type: CREATE_ORDER_RESET });
  }, [orderId, dispatch]);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className={classes.orderSuccess}>
      <CheckCircleIcon className={classes.successIcon} />

      <Typography variant="h4" className={classes.successText}>
        Congratulations!
        <br />
        Your Order has been Placed Successfully
      </Typography>

      {orderId && (
        <Box mt={3}>
          <Typography variant="body1">Order ID:</Typography>
          <Typography variant="body1" className={classes.orderIdText}>
            {orderId}
          </Typography>
        </Box>
      )}

      <Link to="/orders" className={classes.link}>
        <Button variant="contained" className={classes.viewOrdersButton}>
          View Orders
        </Button>
      </Link>

      {/* Confirmation Popup */}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="order-confirmation-title"
        PaperProps={{
          style: { borderRadius: "20px", padding: "10px" }
        }}
      >
        <DialogTitle id="order-confirmation-title" className={classes.popupTitle}>
          Order Confirmed!
        </DialogTitle>
        <DialogContent className={classes.popupContent}>
          <CheckCircleIcon style={{ fontSize: "4rem", color: "#2e7d32", marginBottom: "1rem" }} />
          <Typography variant="h6">Thank you for your purchase!</Typography>
          <Typography variant="body1" style={{ marginTop: "1rem" }}>
            Your order has been placed successfully.
          </Typography>
          <Typography variant="body2" className={classes.popupOrderId}>
            Order ID: #{orderId}
          </Typography>
          <Typography variant="body1" style={{ marginTop: "0.5rem", fontWeight: 600 }}>
            Total Amount: Rs. {totalAmount}
          </Typography>
          <Typography variant="body1" style={{ marginTop: "0.5rem", color: "#666" }}>
            Status: {status}
          </Typography>
        </DialogContent>
        <DialogActions style={{ justifyContent: "center", paddingBottom: "20px" }}>
          <Button onClick={handleClose} variant="contained" style={{ backgroundColor: "#000", color: "#fff", borderRadius: "10px" }}>
            Great!
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default OrderSuccess;
