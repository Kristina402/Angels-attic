import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import MetaData from "../layouts/MataData/MataData";
import Loader from "../layouts/loader/Loader";
import VendorSidebar from "./VendorSidebar";
import VendorHeader from "./VendorHeader";
import { getVendorAnalytics, clearErrors } from "../../actions/analyticsAction";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Box, Typography, Grid, Paper } from "@mui/material";
import { makeStyles } from "@mui/styles";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

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
  },
  sectionTitle: {
    fontSize: "1.5rem !important",
    fontWeight: "800 !important",
    color: "#1a1a1a",
    marginBottom: "2rem !important",
  },
  statCard: {
    padding: "1.5rem",
    borderRadius: "16px !important",
    border: "none !important",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.01) !important",
    display: "flex",
    alignItems: "center",
    gap: "1.25rem",
  },
  statIconBox: {
    width: "56px",
    height: "56px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "28px",
  },
  statValue: {
    fontSize: "1.5rem !important",
    fontWeight: "800 !important",
    color: "#1a1a1a",
  },
  statLabel: {
    fontSize: "0.85rem !important",
    color: "#94a3b8",
    fontWeight: "600 !important",
  },
}));

const SalesAnalytics = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const alert = useAlert();

  const { loading, error, analytics } = useSelector(
    (state) => state.analytics
  );

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    dispatch(getVendorAnalytics());
  }, [dispatch, error, alert]);

  const barState = {
    labels: analytics.monthlySales?.map((item) => item.name),
    datasets: [
      {
        label: "Sales",
        backgroundColor: "#EC4899",
        borderColor: "#EC4899",
        borderWidth: 1,
        hoverBackgroundColor: "#DB2777",
        hoverBorderColor: "#DB2777",
        data: analytics.monthlySales?.map((item) => item.value),
      },
    ],
  };

  const pieState = {
    labels: analytics.topProducts?.map((item) => item.name),
    datasets: [
      {
        data: analytics.topProducts?.map((item) => item.value),
        backgroundColor: [
          "#EC4899",
          "#F472B6",
          "#F9A8D4",
          "#FBCFE8",
          "#FDF2F8",
        ],
        hoverBackgroundColor: [
          "#DB2777",
          "#E11D48",
          "#BE123C",
          "#9F1239",
          "#881337",
        ],
      },
    ],
  };

  if (loading) return <Loader />;

  return (
    <Box className={classes.dashboard}>
      <MetaData title="Sales Analytics - Vendor" />
      <VendorSidebar />
      <Box className={classes.mainContent}>
        <VendorHeader title="Sales Analytics" />

        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={4}>
            <Paper className={classes.statCard}>
              <Box
                className={classes.statIconBox}
                sx={{ backgroundColor: "#EFF6FF", color: "#3B82F6" }}
              >
                <Typography variant="h4">₹</Typography>
              </Box>
              <Box>
                <Typography className={classes.statValue}>
                  {analytics.totalAmount?.toFixed(2)}
                </Typography>
                <Typography className={classes.statLabel}>
                  Total Revenue
                </Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper className={classes.statCard}>
              <Box
                className={classes.statIconBox}
                sx={{ backgroundColor: "#FDF2F8", color: "#EC4899" }}
              >
                <Typography variant="h4">#</Typography>
              </Box>
              <Box>
                <Typography className={classes.statValue}>
                  {analytics.totalOrders}
                </Typography>
                <Typography className={classes.statLabel}>
                  Total Orders
                </Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper className={classes.statCard}>
              <Box
                className={classes.statIconBox}
                sx={{ backgroundColor: "#ECFDF5", color: "#10B981" }}
              >
                <Typography variant="h4">*</Typography>
              </Box>
              <Box>
                <Typography className={classes.statValue}>
                  {analytics.totalItemsSold}
                </Typography>
                <Typography className={classes.statLabel}>
                  Items Sold
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} md={8}>
            <Paper className={classes.sectionPaper}>
              <Typography className={classes.sectionTitle}>
                Monthly Sales
              </Typography>
              <Bar data={barState} />
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper className={classes.sectionPaper}>
              <Typography className={classes.sectionTitle}>
                Top Products
              </Typography>
              <Pie data={pieState} />
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default SalesAnalytics;
