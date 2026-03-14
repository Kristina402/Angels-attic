import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Box,
  Tooltip,
} from "@material-ui/core";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { Link } from "react-router-dom";
import { dispalyMoney } from "../DisplayMoney/DisplayMoney";

const useStyles = makeStyles((theme) => ({
  item_card_new: {
    display: "flex",
    padding: "20px",
    borderRadius: "24px !important",
    boxShadow: "none !important",
    border: "1px solid #f2f2f2",
    marginBottom: "16px",
    backgroundColor: "#ffffff",
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    "&:hover": {
      boxShadow: "0 12px 30px rgba(0,0,0,0.03) !important",
      borderColor: "#e8e8e8",
      transform: "translateY(-2px)",
    },
    [theme.breakpoints.down("sm")]: {
      flexDirection: "row",
      padding: "12px",
      alignItems: "center",
    },
  },
  item_image_wrapper: {
    width: "120px",
    height: "150px",
    borderRadius: "16px",
    overflow: "hidden",
    flexShrink: 0,
    backgroundColor: "#f9f9f9",
    [theme.breakpoints.down("sm")]: {
      width: "80px",
      height: "100px",
    },
  },
  item_image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.5s ease",
    "&:hover": {
      transform: "scale(1.05)",
    },
  },
  item_content_new: {
    flexGrow: 1,
    padding: "0 0 0 24px !important",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    [theme.breakpoints.down("sm")]: {
      padding: "0 0 0 16px !important",
    },
  },
  item_header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  item_title_link: {
    textDecoration: "none",
    color: "#1a1a1a",
    transition: "color 0.2s ease",
    "&:hover": {
      color: "#666",
    },
  },
  item_name_new: {
    fontWeight: "700 !important",
    fontSize: "1rem !important",
    marginBottom: "4px !important",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    lineHeight: "1.4 !important",
  },
  item_price_new: {
    fontWeight: "800 !important",
    fontSize: "1.1rem !important",
    color: "#1a1a1a",
    marginTop: "4px",
  },
  item_actions_new: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "12px",
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
      alignItems: "flex-start",
      gap: "12px",
    },
  },
  quantity_controls_new: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#f5f5f7",
    borderRadius: "14px",
    padding: "4px",
  },
  qty_btn_new: {
    padding: "4px !important",
    color: "#1a1a1a !important",
    backgroundColor: "transparent !important",
    "&:hover": {
      backgroundColor: "#ffffff !important",
      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    },
  },
  qty_value_new: {
    width: "36px",
    textAlign: "center",
    fontWeight: "700 !important",
    fontSize: "0.9rem !important",
    color: "#1a1a1a",
  },
  delete_btn_new: {
    color: "#8e8e93 !important",
    backgroundColor: "transparent !important",
    borderRadius: "12px !important",
    padding: "6px !important",
    transition: "all 0.2s ease !important",
    "&:hover": {
      backgroundColor: "#fff1f0 !important",
      color: "#ff3b30 !important",
    },
  },
  subtotal_text: {
    color: "#8e8e93",
    fontWeight: 600,
    fontSize: "0.85rem",
    letterSpacing: "0.02em",
  },
}));

const CartItem = ({ item, deleteCartItems, decreaseQuantity, increaseQuantity, id }) => {
  const classes = useStyles();

  return (
    <Card className={classes.item_card_new}>
      <div className={classes.item_image_wrapper}>
        <Link to={`/product/${id}`}>
          <CardMedia
            className={classes.item_image}
            image={item.image}
            title={item.name}
          />
        </Link>
      </div>

      <CardContent className={classes.item_content_new}>
        <Box>
          <div className={classes.item_header}>
            <Link to={`/product/${id}`} className={classes.item_title_link}>
              <Typography variant="h6" className={classes.item_name_new}>
                {item.name}
              </Typography>
            </Link>
            <Tooltip title="Remove item">
              <IconButton 
                className={classes.delete_btn_new}
                onClick={() => deleteCartItems(id)}
              >
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </div>
          <Typography className={classes.item_price_new}>
            {dispalyMoney(item.price)}
          </Typography>
        </Box>

        <div className={classes.item_actions_new}>
          <Typography className={classes.subtotal_text}>
            Quantity: 1
          </Typography>
          
          <Typography className={classes.subtotal_text}>
            Total: {dispalyMoney(item.price)}
          </Typography>
        </div>
      </CardContent>
    </Card>
  );
};

export default CartItem;
