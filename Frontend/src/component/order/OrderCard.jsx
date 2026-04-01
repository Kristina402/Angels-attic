import React, { useState } from "react";
import {
  Card,
  Typography,
  Button,
  Divider,
  useMediaQuery,
  Box,
  Chip,
  Grid,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import ReplayIcon from "@mui/icons-material/Replay";
import VisibilityIcon from "@mui/icons-material/Visibility";
import RateReviewIcon from "@mui/icons-material/RateReview";
import CancelIcon from "@mui/icons-material/Cancel";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import EventIcon from "@mui/icons-material/Event";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import { addItemToCart } from "../../actions/cartAction";
import { cancelOrder, clearErrors } from "../../actions/orderAction";
import { useHistory } from "react-router-dom";
import DialogBox from "../Product/DialogBox";
import { dispalyMoney } from "../DisplayMoney/DisplayMoney";
import { CANCEL_ORDER_RESET } from "../../constants/orderConstant";

const useStyles = makeStyles((theme) => ({
  orderCard: {
    backgroundColor: "#fff",
    borderRadius: "20px !important",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.05) !important",
    marginBottom: "2rem",
    overflow: "hidden",
    border: "none !important",
  },
  cardHeader: {
    padding: "1.5rem 2rem",
    backgroundColor: "#fafafa",
    borderBottom: "1px solid #eee",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "1rem",
  },
  headerInfo: {
    display: "flex",
    gap: "2rem",
    flexWrap: "wrap",
  },
  infoItem: {
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
  },
  infoLabel: {
    fontSize: "0.75rem !important",
    color: "#888",
    textTransform: "uppercase",
    fontWeight: "700 !important",
    letterSpacing: "0.5px",
  },
  infoValue: {
    fontSize: "0.9rem !important",
    fontWeight: "600 !important",
    color: "#1a1a1a",
  },
  cardContent: {
    padding: "2rem",
  },
  productRow: {
    display: "flex",
    gap: "1.5rem",
    marginBottom: "1.5rem",
    "&:last-child": {
      marginBottom: 0,
    },
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
    },
  },
  imageWrapper: {
    width: "120px",
    height: "120px",
    borderRadius: "12px",
    overflow: "hidden",
    backgroundColor: "#f5f5f5",
    flexShrink: 0,
  },
  productImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  productInfo: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  productName: {
    fontSize: "1.1rem !important",
    fontWeight: "700 !important",
    color: "#1a1a1a",
    marginBottom: "0.5rem !important",
  },
  productMeta: {
    display: "flex",
    gap: "1.5rem",
    color: "#666",
    fontSize: "0.9rem !important",
  },
  footerSection: {
    padding: "1.5rem 2rem",
    backgroundColor: "#fff",
    borderTop: "1px solid #eee",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
      gap: "1.5rem",
      alignItems: "flex-start",
    },
  },
  shippingInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
  },
  addressText: {
    color: "#666",
    fontSize: "0.85rem !important",
    maxWidth: "300px",
  },
  actionButtons: {
    display: "flex",
    gap: "1rem",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      flexDirection: "column",
    },
  },
  btnPrimary: {
    backgroundColor: "#1a1a1a !important",
    color: "#fff !important",
    borderRadius: "10px !important",
    textTransform: "none !important",
    fontWeight: "600 !important",
    padding: "0.6rem 1.5rem !important",
    "&:hover": {
      backgroundColor: "#333 !important",
    },
  },
  btnSecondary: {
    borderColor: "#eee !important",
    color: "#1a1a1a !important",
    borderRadius: "10px !important",
    textTransform: "none !important",
    fontWeight: "600 !important",
    padding: "0.6rem 1.5rem !important",
    "&:hover": {
      borderColor: "#1a1a1a !important",
      backgroundColor: "transparent !important",
    },
  },
  btnCancel: {
    borderColor: "#fee2e2 !important",
    color: "#ef4444 !important",
    borderRadius: "10px !important",
    textTransform: "none !important",
    fontWeight: "600 !important",
    padding: "0.6rem 1.5rem !important",
    "&:hover": {
      borderColor: "#ef4444 !important",
      backgroundColor: "#fef2f2 !important",
    },
  },
  statusBadge: {
    fontWeight: "700 !important",
    fontSize: "0.75rem !important",
    borderRadius: "8px !important",
  },
}));

const OrderCard = ({ item, user }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const alert = useAlert();
  const [open, setOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  const { error: cancelError, isCancelled, loading: cancelLoading } = useSelector((state) => state.deleteUpdateOrder);

  const { shippingInfo, orderItems, orderStatus, createdAt, _id, totalPrice } = item;

  React.useEffect(() => {
    if (cancelError) {
      alert.error(cancelError);
      dispatch(clearErrors());
    }
    if (isCancelled) {
      alert.success("Order Cancelled Successfully");
      dispatch({ type: CANCEL_ORDER_RESET });
      // The parent component should handle the refresh or we can use history.push
      window.location.reload();
    }
  }, [dispatch, cancelError, alert, isCancelled]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return { bg: "#ECFDF5", text: "#10B981" };
      case "Processing":
        return { bg: "#FFFBEB", text: "#F59E0B" };
      case "Shipped":
        return { bg: "#EFF6FF", text: "#3B82F6" };
      case "Cancelled":
        return { bg: "#FEF2F2", text: "#EF4444" };
      default:
        return { bg: "#F3F4F6", text: "#6B7280" };
    }
  };

  const statusStyle = getStatusColor(orderStatus);

  const addToCartHandler = (id) => {
    dispatch(addItemToCart(id, 1));
    alert.success("Item Added to Cart");
    history.push("/cart");
  };

  const handleReviewOpen = (productId) => {
    setSelectedProductId(productId);
    setOpen(true);
  };

  const cancelOrderHandler = (id) => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      dispatch(cancelOrder(id));
    }
  };

  return (
    <Card className={classes.orderCard}>
      {/* Header */}
      <div className={classes.cardHeader}>
        <div className={classes.headerInfo}>
          <div className={classes.infoItem}>
            <Typography className={classes.infoLabel}>Order Placed</Typography>
            <Typography className={classes.infoValue}>{formatDate(createdAt)}</Typography>
          </div>
          <div className={classes.infoItem}>
            <Typography className={classes.infoLabel}>Total Amount</Typography>
            <Typography className={classes.infoValue}>{dispalyMoney(totalPrice)}</Typography>
          </div>
          <div className={classes.infoItem}>
            <Typography className={classes.infoLabel}>Order ID</Typography>
            <Typography className={classes.infoValue}>#{_id.substring(0, 12)}...</Typography>
          </div>
        </div>
        <Chip
          label={orderStatus}
          className={classes.statusBadge}
          sx={{
            backgroundColor: statusStyle.bg,
            color: statusStyle.text,
          }}
        />
      </div>

      {/* Content */}
      <div className={classes.cardContent}>
        {orderItems.map((product) => (
          <div key={product.productId} className={classes.productRow}>
            <div className={classes.imageWrapper}>
              <img
                src={product.image}
                alt={product.name}
                className={classes.productImage}
              />
            </div>
            <div className={classes.productInfo}>
              <Typography className={classes.productName}>{product.name}</Typography>
              <div className={classes.productMeta}>
                <span>Quantity: {product.quantity}</span>
                <span>Price: {dispalyMoney(product.price)}</span>
              </div>
              <Box mt={2} display="flex" gap={1}>
                <Button
                  size="small"
                  variant="text"
                  startIcon={<RateReviewIcon />}
                  onClick={() => handleReviewOpen(product.productId)}
                  sx={{ color: "#666", fontSize: "0.8rem", textTransform: "none" }}
                >
                  Write Review
                </Button>
              </Box>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className={classes.footerSection}>
        <div className={classes.shippingInfo}>
          <Typography className={classes.infoLabel}>Shipping To</Typography>
          <Typography className={classes.infoValue} style={{ fontSize: "0.85rem" }}>
            {user.name}
          </Typography>
          <Typography className={classes.addressText}>
            {
              [
                shippingInfo.address,
                shippingInfo.city,
                shippingInfo.state,
                shippingInfo.country
              ].filter(Boolean).join(", ") + (shippingInfo.pinCode ? ` - ${shippingInfo.pinCode}` : "")
            }
          </Typography>
        </div>
        <div className={classes.actionButtons}>
          {(orderStatus === "Pending" || orderStatus === "Processing") && (
            <Button
              variant="outlined"
              className={classes.btnCancel}
              startIcon={<CancelIcon />}
              onClick={() => cancelOrderHandler(_id)}
              disabled={cancelLoading}
            >
              {cancelLoading ? "Cancelling..." : "Cancel Order"}
            </Button>
          )}
          <Button
            variant="outlined"
            className={classes.btnSecondary}
            startIcon={<VisibilityIcon />}
            onClick={() => history.push(`/product/${orderItems[0].productId}`)}
          >
            View Details
          </Button>
          <Button
            variant="contained"
            className={classes.btnPrimary}
            onClick={() => history.push("/products")}
          >
            Shop More
          </Button>
        </div>
      </div>

      <DialogBox
        open={open}
        handleClose={() => setOpen(false)}
        id={selectedProductId}
      />
    </Card>
  );
};

export default OrderCard;
