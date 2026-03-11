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
    padding: "24px",
    borderRadius: "20px !important",
    boxShadow: "none !important",
    border: "1px solid #f0f0f0",
    marginBottom: "20px",
    backgroundColor: "#ffffff",
    transition: "all 0.3s ease",
    "&:hover": {
      boxShadow: "0 10px 30px rgba(0,0,0,0.05) !important",
      borderColor: "#e0e0e0",
    },
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
      padding: "16px",
    },
  },
  item_image_wrapper: {
    width: "140px",
    height: "170px",
    borderRadius: "12px",
    overflow: "hidden",
    flexShrink: 0,
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      height: "200px",
      marginBottom: "16px",
    },
  },
  item_image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  item_content_new: {
    flexGrow: 1,
    padding: "0 0 0 24px !important",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    [theme.breakpoints.down("sm")]: {
      padding: "0 !important",
    },
  },
  item_header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  item_title_link: {
    textDecoration: "none",
    color: "#000000",
    "&:hover h6": {
      color: "#666666",
    },
  },
  item_name_new: {
    fontWeight: "700 !important",
    fontSize: "1.1rem !important",
    marginBottom: "4px !important",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
  item_price_new: {
    fontWeight: "800 !important",
    fontSize: "1.2rem !important",
    color: "#000000",
    marginTop: "8px",
  },
  item_actions_new: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "16px",
  },
  quantity_controls_new: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    borderRadius: "10px",
    padding: "2px",
    border: "1px solid #eeeeee",
  },
  qty_btn_new: {
    padding: "6px !important",
    color: "#000000 !important",
    "&:hover": {
      backgroundColor: "#ffffff !important",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    },
  },
  qty_value_new: {
    width: "40px",
    textAlign: "center",
    fontWeight: "700 !important",
    fontSize: "0.95rem !important",
  },
  delete_btn_new: {
    color: "#ff4d4f !important",
    backgroundColor: "#fff1f0 !important",
    borderRadius: "10px !important",
    padding: "8px !important",
    transition: "all 0.2s ease !important",
    "&:hover": {
      backgroundColor: "#ff4d4f !important",
      color: "#ffffff !important",
      transform: "scale(1.05)",
    },
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
            <Tooltip title="Remove from cart">
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
          <div className={classes.quantity_controls_new}>
            <IconButton 
              className={classes.qty_btn_new}
              onClick={() => decreaseQuantity(id, item.quantity)}
            >
              <RemoveIcon fontSize="small" />
            </IconButton>
            <Typography className={classes.qty_value_new}>
              {item.quantity}
            </Typography>
            <IconButton 
              className={classes.qty_btn_new}
              onClick={() => increaseQuantity(id, item.quantity, item.stock)}
            >
              <AddIcon fontSize="small" />
            </IconButton>
          </div>
          
          <Typography variant="body2" style={{ color: "#999999", fontWeight: 500 }}>
            Subtotal: {dispalyMoney(item.price * item.quantity)}
          </Typography>
        </div>
      </CardContent>
    </Card>
  );
};

export default CartItem;
