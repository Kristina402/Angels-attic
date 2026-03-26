import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import MetaData from "../layouts/MataData/MataData";
import Loader from "../layouts/loader/Loader";
import VendorSidebar from "./VendorSidebar";
import VendorHeader from "./VendorHeader";
import { getVendorAnalytics, clearErrors } from "../../actions/analyticsAction";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Box, Typography, Grid, Paper } from "@mui/material";
import { makeStyles } from "@mui/styles";

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
  }, [dispatch, alert, error]);

  const { totalAmount, totalOrders, totalItemsSold, monthlySales, topProducts } = analytics || {};

  const barOptions = {
    chart: { type: "column", height: 400, backgroundColor: "transparent" },
    title: { text: null },
    xAxis: { categories: monthlySales?.map((s) => s.name) || [] },
    yAxis: { title: { text: "Revenue" } },
    series: [{
      name: "Monthly Revenue",
      data: monthlySales?.map((s) => s.value) || [],
      color: "#EC4899"
    }],
    credits: { enabled: false }
  };

  const pieOptions = {
    chart: { type: "pie", height: 400, backgroundColor: "transparent" },
    title: { text: null },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: { enabled: true, format: "<b>{point.name}</b>: {point.percentage:.1f} %" },
        showInLegend: true
      }
    },
    series: [{
      name: "Revenue",
      colorByPoint: true,
      data: topProducts?.map((p) => ({ name: p.name, y: p.value })) || []
    }],
    colors: ["#EC4899", "#3B82F6", "#10B981", "#F59E0B", "#8B5CF6"],
    credits: { enabled: false }
  };

  return (
    <Box className={classes.dashboard}>
      <MetaData title="Sales Analytics - Vendor" />
      <VendorSidebar />
      <Box className={classes.mainContent}>
        <VendorHeader title="Sales Analytics" />

        {loading ? (
          <Loader />
        ) : (
          <Box sx={{ mt: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={4}>
                <Paper className={classes.statCard}>
                  <Box className={classes.statIconBox} sx={{ bgcolor: "#eff6ff", color: "#3b82f6" }}>
                    Rs
                  </Box>
                  <Box>
                    <Typography className={classes.statLabel}>Total Sales</Typography>
                    <Typography className={classes.statValue}>
                      Rs. {totalAmount?.toLocaleString()}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <Paper className={classes.statCard}>
                  <Box className={classes.statIconBox} sx={{ bgcolor: "#fdf2f8", color: "#ec4899" }}>
                    O
                  </Box>
                  <Box>
                    <Typography className={classes.statLabel}>Total Orders</Typography>
                    <Typography className={classes.statValue}>{totalOrders}</Typography>
                  </Box>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <Paper className={classes.statCard}>
                  <Box className={classes.statIconBox} sx={{ bgcolor: "#ecfdf5", color: "#10b981" }}>
                    S
                  </Box>
                  <Box>
                    <Typography className={classes.statLabel}>Items Sold</Typography>
                    <Typography className={classes.statValue}>{totalItemsSold}</Typography>
                  </Box>
                </Paper>
              </Grid>

              <Grid item xs={12} md={7}>
                <Paper className={classes.sectionPaper}>
                  <Typography className={classes.sectionTitle}>Monthly Sales</Typography>
                  <HighchartsReact highcharts={Highcharts} options={barOptions} />
                </Paper>
              </Grid>

              <Grid item xs={12} md={5}>
                <Paper className={classes.sectionPaper}>
                  <Typography className={classes.sectionTitle}>Top Products</Typography>
                  <HighchartsReact highcharts={Highcharts} options={pieOptions} />
                </Paper>
              </Grid>
            </Grid>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default SalesAnalytics;
