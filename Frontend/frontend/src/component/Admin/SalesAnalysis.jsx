import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import MetaData from "../layouts/MataData/MataData";
import Loader from "../layouts/loader/Loader";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import { getAdminAnalytics, clearErrors } from "../../actions/analyticsAction";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Box, Typography, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from "@mui/material";
import { makeStyles } from "@mui/styles";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";

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
    height: "100%",
  },
  sectionTitle: {
    fontSize: "1.25rem !important",
    fontWeight: "800 !important",
    color: "#1a1a1a",
    marginBottom: "1.5rem !important",
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
  table: {
    "& .MuiTableCell-head": {
      backgroundColor: "#F8F9FB",
      color: "#64748b",
      fontWeight: "700",
      fontSize: "0.75rem",
      textTransform: "uppercase",
    },
    "& .MuiTableCell-body": {
      fontSize: "0.85rem",
      color: "#334155",
    },
  },
}));

const SalesAnalysis = () => {
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
    dispatch(getAdminAnalytics());
  }, [dispatch, alert, error]);

  const { totalAmount, totalOrders, totalItemsSold, monthlySales, topProducts, recentTransactions } = analytics || {};

  const trendOptions = {
    chart: { type: "areaspline", height: 300, backgroundColor: "transparent" },
    title: { text: null },
    xAxis: { categories: monthlySales?.map((s) => s.name) || [] },
    yAxis: { title: { text: "Revenue" } },
    series: [{
      name: "Monthly Revenue",
      data: monthlySales?.map((s) => s.value) || [],
      color: "#EC4899",
      fillColor: {
        linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
        stops: [[0, "rgba(236, 72, 153, 0.2)"], [1, "rgba(236, 72, 153, 0)"]]
      }
    }],
    credits: { enabled: false }
  };

  const productOptions = {
    chart: { type: "pie", height: 300, backgroundColor: "transparent" },
    title: { text: null },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: { enabled: false },
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
      <MetaData title="Sales Analysis - Admin" />
      <AdminSidebar />
      <Box className={classes.mainContent}>
        <AdminHeader title="Sales Analysis" />

        {loading ? (
          <Loader />
        ) : (
          <Box sx={{ mt: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={4}>
                <Paper className={classes.statCard}>
                  <Box className={classes.statIconBox} sx={{ bgcolor: "#eff6ff", color: "#3b82f6" }}>
                    <AttachMoneyIcon />
                  </Box>
                  <Box>
                    <Typography className={classes.statLabel}>Total Revenue</Typography>
                    <Typography className={classes.statValue}>
                      Rs. {totalAmount?.toLocaleString()}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <Paper className={classes.statCard}>
                  <Box className={classes.statIconBox} sx={{ bgcolor: "#fdf2f8", color: "#ec4899" }}>
                    <ShoppingBagOutlinedIcon />
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
                    <Inventory2OutlinedIcon />
                  </Box>
                  <Box>
                    <Typography className={classes.statLabel}>Total Items Sold</Typography>
                    <Typography className={classes.statValue}>{totalItemsSold}</Typography>
                  </Box>
                </Paper>
              </Grid>

              <Grid item xs={12} md={8}>
                <Paper className={classes.sectionPaper}>
                  <Typography className={classes.sectionTitle}>Sales Trend</Typography>
                  <HighchartsReact highcharts={Highcharts} options={trendOptions} />
                </Paper>
              </Grid>

              <Grid item xs={12} md={4}>
                <Paper className={classes.sectionPaper}>
                  <Typography className={classes.sectionTitle}>Top Products</Typography>
                  <HighchartsReact highcharts={Highcharts} options={productOptions} />
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <Paper className={classes.sectionPaper}>
                  <Typography className={classes.sectionTitle}>Recent Transactions</Typography>
                  <TableContainer>
                    <Table className={classes.table}>
                      <TableHead>
                        <TableRow>
                          <TableCell>Order ID</TableCell>
                          <TableCell>Customer</TableCell>
                          <TableCell>Date</TableCell>
                          <TableCell>Amount</TableCell>
                          <TableCell>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {recentTransactions?.map((row) => (
                          <TableRow key={row._id}>
                            <TableCell sx={{ fontWeight: 600 }}>#{row._id}</TableCell>
                            <TableCell>{row.user?.name}</TableCell>
                            <TableCell>{new Date(row.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell>Rs. {row.totalPrice.toLocaleString()}</TableCell>
                            <TableCell>
                              <Chip
                                label={row.orderStatus}
                                size="small"
                                sx={{
                                  bgcolor: "#ecfdf5",
                                  color: "#10b981",
                                  fontWeight: 700,
                                  fontSize: "0.7rem",
                                }}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default SalesAnalysis;
