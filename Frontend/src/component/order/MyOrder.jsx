import React, { useEffect } from "react";
import { makeStyles } from "@mui/styles";
import { Typography } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { myOrders, clearErrors } from "../../actions/orderAction";
import MetaData from "../layouts/MataData/MataData";
import CricketBallLoader from "../layouts/loader/Loader";
import { useAlert } from "react-alert";
import OrderCard from "./OrderCard";

const useStyles = makeStyles((theme) => ({
  orderPageContainer: {
    backgroundColor: "#F8F9FB",
    minHeight: "100vh",
    padding: "8rem 1rem 4rem",
  },
  contentWrapper: {
    maxWidth: "1000px",
    margin: "0 auto",
  },
  headerSection: {
    marginBottom: "3rem",
    textAlign: "center",
  },
  orderPageTitle: {
    fontSize: "2.5rem !important",
    fontWeight: "800 !important",
    color: "#1a1a1a",
    letterSpacing: "-1px",
    marginBottom: "0.5rem !important",
  },
  orderPageText: {
    color: "#666",
    fontSize: "1.1rem !important",
  },
  noOrders: {
    textAlign: "center",
    padding: "4rem",
    backgroundColor: "#fff",
    borderRadius: "20px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.05)",
    marginTop: "2rem",
  },
}));

const MyOrder = () => {
  const classes = useStyles();
  const currentYear = new Date().getFullYear();
  const dispatch = useDispatch();
  const alert = useAlert();

  const { orders, loading, error } = useSelector((state) => state.myOrder);
  const { user } = useSelector((state) => state.userData);

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    dispatch(myOrders());
    // eslint-disable-next-line react-hooks/exhaustive-deps

  }, [dispatch, alert, error]);

  return (
    <>
      {loading ? (
        <CricketBallLoader />
      ) : (
        <div className={classes.orderPageContainer}>
          <MetaData title="My Orders - Angels Attic" />
          
          <div className={classes.contentWrapper}>
            <div className={classes.headerSection}>
              <Typography variant="h2" className={classes.orderPageTitle}>
                My Orders
              </Typography>
              <Typography variant="body1" className={classes.orderPageText}>
                {orders && orders.length > 0 
                  ? `${orders.length} order${orders.length > 1 ? 's' : ''} placed in ${currentYear}`
                  : "You haven't placed any orders yet."}
              </Typography>
            </div>

            {orders && orders.length > 0 ? (
              orders.map((item) => (
                <OrderCard key={item._id} item={item} user={user} />
              ))
            ) : (
              <div className={classes.noOrders}>
                <Typography variant="h6" color="textSecondary">
                  Your order history is empty.
                </Typography>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default MyOrder;
