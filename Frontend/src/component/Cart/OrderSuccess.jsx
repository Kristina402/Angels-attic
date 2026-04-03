import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import { 
  Typography, 
  Button, 
  Box, 
  Dialog, 
  DialogContent, 
  DialogActions,
  Chip
} from "@material-ui/core";
import { useAlert } from "react-alert";
import { Link, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { CREATE_ORDER_RESET } from "../../constants/orderConstant";
import { motion } from "framer-motion";
import MetaData from "../layouts/MataData/MataData";

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
  const alert = useAlert();
  const queryParams = new URLSearchParams(location.search);
  const orderId = queryParams.get("id");
  const totalAmount = queryParams.get("total");
  const status = queryParams.get("status");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (orderId) {
      setOpen(true);
      alert.success("Payment Successful! Your order has been placed.");
    }
    // Reset order state so user can place new order later
    dispatch({ type: CREATE_ORDER_RESET });
  }, [orderId, dispatch, alert]);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className={classes.orderSuccess}>
      <MetaData title="Payment Successful - Angels Attic" />
      
      {/* Background Content (Fallback UI) */}
      <Box display="flex" flexDirection="column" alignItems="center">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5 }}
        >
          <CheckCircleIcon className={classes.successIcon} />
          <Typography variant="h4" className={classes.successText}>
            Payment Successful!
          </Typography>
          <Typography variant="body1" style={{ color: "#666", marginBottom: "3rem", maxWidth: "500px" }}>
            Thank you for your purchase. Your order has been placed successfully and is being processed.
          </Typography>
          
          <Box display="flex" gap="1.5rem" justifyContent="center">
            <Link to="/orders" className={classes.link}>
              <Button variant="contained" className={classes.viewOrdersButton}>
                View My Orders
              </Button>
            </Link>
            <Link to="/products" className={classes.link}>
              <Button 
                variant="outlined" 
                className={classes.viewOrdersButton}
                style={{ 
                  backgroundColor: "transparent", 
                  color: "#1a1a1a", 
                  border: "2px solid #1a1a1a"
                }}
              >
                Continue Shopping
              </Button>
            </Link>
          </Box>
        </motion.div>
      </Box>

      {/* Confirmation Popup - Main UI */}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="order-confirmation-title"
        maxWidth="xs"
        fullWidth
        PaperProps={{
          style: { 
            borderRadius: "24px", 
            padding: "1.5rem",
            boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
          }
        }}
      >
        <DialogContent className={classes.popupContent} style={{ paddingBottom: '0.5rem' }}>
          <Box mb={3} display="flex" justifyContent="center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              <CheckCircleIcon style={{ fontSize: "6rem", color: "#10B981" }} />
            </motion.div>
          </Box>
          
          <Typography variant="h5" style={{ fontWeight: 800, color: "#1a1a1a", marginBottom: "0.5rem" }}>
            Payment Successful!
          </Typography>
          
          <Typography variant="body1" style={{ color: "#666", marginBottom: "2rem" }}>
            Your thrift find is on its way.
          </Typography>

          <Box 
            p={2.5} 
            mb={3} 
            style={{ 
              backgroundColor: "#F8F9FB", 
              borderRadius: "16px",
              textAlign: "left"
            }}
          >
            <Box display="flex" justifyContent="space-between" mb={1.5}>
              <Typography style={{ color: "#888", fontSize: "0.85rem", fontWeight: 600 }}>ORDER ID</Typography>
              <Typography style={{ color: "#1a1a1a", fontSize: "0.85rem", fontWeight: 700 }}>#{orderId?.substring(0, 12)}...</Typography>
            </Box>
            {totalAmount && (
              <Box display="flex" justifyContent="space-between" mb={1.5}>
                <Typography style={{ color: "#888", fontSize: "0.85rem", fontWeight: 600 }}>TOTAL PAID</Typography>
                <Typography style={{ color: "#EC4899", fontSize: "0.85rem", fontWeight: 800 }}>Rs. {totalAmount}</Typography>
              </Box>
            )}
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography style={{ color: "#888", fontSize: "0.85rem", fontWeight: 600 }}>STATUS</Typography>
              <Chip 
                label={status || "Paid"} 
                size="small" 
                style={{ 
                  height: "20px", 
                  fontSize: "0.7rem", 
                  fontWeight: 700,
                  backgroundColor: "#ECFDF5",
                  color: "#10B981"
                }} 
              />
            </Box>
          </Box>
        </DialogContent>
        
        <DialogActions style={{ padding: "0 1rem 1.5rem", flexDirection: "column", gap: "0.8rem" }}>
          <Link to="/products" style={{ textDecoration: 'none', width: '100%' }}>
            <Button 
              fullWidth
              variant="contained" 
              style={{ 
                backgroundColor: "#1a1a1a", 
                color: "#fff", 
                borderRadius: "12px",
                padding: "0.8rem",
                textTransform: "none",
                fontWeight: 700,
                fontSize: "1rem"
              }}
            >
              Continue Shopping
            </Button>
          </Link>
          <Link to="/orders" style={{ textDecoration: 'none', width: '100%' }}>
            <Button 
              fullWidth
              variant="text" 
              style={{ 
                color: "#666", 
                textTransform: "none",
                fontWeight: 600
              }}
            >
              View My Orders
            </Button>
          </Link>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default OrderSuccess;
