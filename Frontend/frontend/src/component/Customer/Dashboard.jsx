import React, { useEffect } from "react";
import { Typography, Grid, Box, Paper, Container, Avatar, Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useSelector, useDispatch } from "react-redux";
import { myOrders } from "../../actions/orderAction";
import MetaData from "../layouts/MataData/MataData";
import { Link } from "react-router-dom";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import FavoriteIcon from "@mui/icons-material/Favorite";
import OrderCard from "../order/OrderCard";

const useStyles = makeStyles((theme) => ({
  dashboardContainer: {
    backgroundColor: "#fdfdfd",
    minHeight: "100vh",
    paddingTop: "8rem",
    paddingBottom: "4rem",
  },
  welcomeSection: {
    marginBottom: "3rem",
    display: "flex",
    alignItems: "center",
    gap: "2rem",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
      textAlign: "center",
    },
  },
  avatar: {
    width: "100px",
    height: "100px",
    border: "4px solid #1a1a1a",
  },
  statCard: {
    padding: "1.5rem",
    borderRadius: "20px",
    border: "1px solid #f2f2f2",
    textAlign: "center",
    textDecoration: "none",
    color: "inherit",
    transition: "all 0.3s ease",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.5rem",
    "&:hover": {
      borderColor: "#1a1a1a",
      transform: "translateY(-3px)",
    },
  },
  sectionTitle: {
    fontWeight: "800 !important",
    marginBottom: "1.5rem !important",
    letterSpacing: "-0.5px",
  },
  orderList: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
}));

const Dashboard = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.userData);
  const { orders } = useSelector((state) => state.myOrder);
  const { wishlistItems } = useSelector((state) => state.wishlist);

  useEffect(() => {
    dispatch(myOrders());
  }, [dispatch]);

  const stats = [
    {
      label: "Orders",
      value: orders ? orders.length : 0,
      icon: <ShoppingBagIcon />,
      link: "/orders",
    },
    {
      label: "Wishlist",
      value: wishlistItems ? wishlistItems.length : 0,
      icon: <FavoriteIcon style={{ color: "#ff3b30" }} />,
      link: "/wishlist",
    },
    {
      label: "Profile",
      value: "Manage",
      icon: <AccountCircleIcon />,
      link: "/account",
    },
  ];

  return (
    <div className={classes.dashboardContainer}>
      <MetaData title="My Dashboard - Angels Attic" />
      <Container maxWidth="lg">
        <div className={classes.welcomeSection}>
          <Avatar
            src={user.avatar && user.avatar.url}
            alt={user.name}
            className={classes.avatar}
          />
          <Box>
            <Typography variant="h3" style={{ fontWeight: 800, letterSpacing: "-1px" }}>
              Hello, {user.name.split(" ")[0]}!
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Welcome back to your thrift dashboard. Track your orders and managed your saved finds.
            </Typography>
          </Box>
        </div>

        <Grid container spacing={3} style={{ marginBottom: "4rem" }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={4} key={index}>
              <Link to={stat.link} className={classes.statCard}>
                <Box style={{ color: "#1a1a1a" }}>{stat.icon}</Box>
                <Typography variant="h5" style={{ fontWeight: 800 }}>{stat.value}</Typography>
                <Typography variant="body2" color="textSecondary" style={{ fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px" }}>
                  {stat.label}
                </Typography>
              </Link>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Typography variant="h5" className={classes.sectionTitle}>
              Recent Orders
            </Typography>
            {orders && orders.length > 0 ? (
              <div className={classes.orderList}>
                {orders.slice(0, 3).map((order) => (
                  <OrderCard key={order._id} item={order} user={user} />
                ))}
                <Box mt={2} textAlign="center">
                  <Button component={Link} to="/orders" style={{ color: "#1a1a1a", fontWeight: 700, textTransform: "none" }}>
                    View All Orders
                  </Button>
                </Box>
              </div>
            ) : (
              <Paper style={{ padding: "3rem", textAlign: "center", borderRadius: "20px", border: "1px solid #f2f2f2" }} elevation={0}>
                <Typography color="textSecondary">You haven't placed any orders yet.</Typography>
                <Button component={Link} to="/products" variant="contained" style={{ backgroundColor: "#1a1a1a", marginTop: "1.5rem", borderRadius: "12px", textTransform: "none" }}>
                  Start Shopping
                </Button>
              </Paper>
            )}
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="h5" className={classes.sectionTitle}>
              Account Summary
            </Typography>
            <Paper style={{ padding: "2rem", borderRadius: "20px", border: "1px solid #f2f2f2" }} elevation={0}>
              <Box mb={2}>
                <Typography variant="caption" color="textSecondary" style={{ fontWeight: 700, textTransform: "uppercase" }}>Email Address</Typography>
                <Typography variant="body1" style={{ fontWeight: 600 }}>{user.email}</Typography>
              </Box>
              <Box mb={2}>
                <Typography variant="caption" color="textSecondary" style={{ fontWeight: 700, textTransform: "uppercase" }}>Phone Number</Typography>
                <Typography variant="body1" style={{ fontWeight: 600 }}>{user.phone || "Not provided"}</Typography>
              </Box>
              <Button component={Link} to="/profile/update" variant="outlined" fullWidth style={{ borderColor: "#1a1a1a", color: "#1a1a1a", borderRadius: "12px", textTransform: "none", fontWeight: 700, marginTop: "1rem" }}>
                Edit Profile
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default Dashboard;
