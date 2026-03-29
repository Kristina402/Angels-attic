import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import MetaData from "../layouts/MataData/MataData";
import Loader from "../layouts/loader/Loader";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import { getAdminReports, clearErrors } from "../../actions/analyticsAction";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { 
  Box, Typography, Grid, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Chip, TextField, Button 
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import AssessmentIcon from "@mui/icons-material/Assessment";
import FilterListIcon from "@mui/icons-material/FilterList";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import DescriptionIcon from "@mui/icons-material/Description";

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
  filterBox: {
    display: "flex",
    gap: "1rem",
    alignItems: "center",
    marginBottom: "2rem",
    backgroundColor: "#FFFFFF",
    padding: "1.5rem",
    borderRadius: "16px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.02)",
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
  filterBtn: {
    backgroundColor: "#EC4899 !important",
    color: "#FFFFFF !important",
    padding: "10px 24px !important",
    borderRadius: "12px !important",
    textTransform: "none !important",
    fontWeight: "600 !important",
    "&:hover": {
      backgroundColor: "#DB2777 !important",
    },
  },
}));

const Reports = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const alert = useAlert();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { loading, error, reports } = useSelector((state) => state.analytics);

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    dispatch(getAdminReports());
  }, [dispatch, alert, error]);

  const handleFilter = () => {
    if (!startDate || !endDate) {
      alert.error("Please select both Start and End dates");
      return;
    }
    dispatch(getAdminReports(startDate, endDate));
  };

  const chartOptions = {
    chart: { type: "column", height: 300, backgroundColor: "transparent" },
    title: { text: null },
    xAxis: { categories: reports?.map((r) => r.type) || [] },
    yAxis: { title: { text: "Revenue (Rs.)" } },
    series: [{
      name: "Revenue",
      data: reports?.map((r) => r.totalRevenue) || [],
      color: "#EC4899"
    }],
    credits: { enabled: false }
  };

  return (
    <Box className={classes.dashboard}>
      <MetaData title="System Reports - Admin" />
      <AdminSidebar />
      <Box className={classes.mainContent}>
        <AdminHeader title="System Reports" />

        <Box sx={{ mt: 4 }}>
          <Box className={classes.filterBox}>
            <FilterListIcon sx={{ color: "#94a3b8" }} />
            <Typography sx={{ fontWeight: 600, color: "#475569", mr: 2 }}>Filter by Date:</Typography>
            <TextField
              type="date"
              size="small"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              type="date"
              size="small"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <Button 
              className={classes.filterBtn} 
              onClick={handleFilter}
              disabled={loading}
            >
              Generate Report
            </Button>
            {(startDate || endDate) && (
              <Button 
                sx={{ color: "#64748b", fontWeight: 600, textTransform: "none" }}
                onClick={() => {
                  setStartDate("");
                  setEndDate("");
                  dispatch(getAdminReports());
                }}
              >
                Reset
              </Button>
            )}
          </Box>

          {loading ? (
            <Loader />
          ) : (
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Paper className={classes.statCard}>
                  <Box className={classes.statIconBox} sx={{ bgcolor: "#eff6ff", color: "#3b82f6" }}>
                    <TrendingUpIcon />
                  </Box>
                  <Box>
                    <Typography className={classes.statLabel}>Total Sales</Typography>
                    <Typography className={classes.statValue}>
                      {reports?.length > 0 ? `Rs. ${reports[0].totalRevenue.toLocaleString()}` : "Rs. 0"}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Paper className={classes.statCard}>
                  <Box className={classes.statIconBox} sx={{ bgcolor: "#fdf2f8", color: "#ec4899" }}>
                    <AssessmentIcon />
                  </Box>
                  <Box>
                    <Typography className={classes.statLabel}>Total Orders</Typography>
                    <Typography className={classes.statValue}>
                      {reports?.reduce((acc, curr) => acc + curr.totalOrders, 0) || 0}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Paper className={classes.statCard}>
                  <Box className={classes.statIconBox} sx={{ bgcolor: "#ecfdf5", color: "#10b981" }}>
                    <DescriptionIcon />
                  </Box>
                  <Box>
                    <Typography className={classes.statLabel}>Reports Gen.</Typography>
                    <Typography className={classes.statValue}>{reports?.length || 0}</Typography>
                  </Box>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Paper className={classes.statCard}>
                  <Box className={classes.statIconBox} sx={{ bgcolor: "#f5f3ff", color: "#8b5cf6" }}>
                    <TrendingUpIcon />
                  </Box>
                  <Box>
                    <Typography className={classes.statLabel}>Avg. Revenue</Typography>
                    <Typography className={classes.statValue}>
                      Rs. {reports?.length > 0 ? Math.round(reports[0].totalRevenue / (reports[0].totalOrders || 1)).toLocaleString() : 0}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <Paper className={classes.sectionPaper}>
                  <Typography className={classes.sectionTitle}>Revenue by Report Type</Typography>
                  <HighchartsReact highcharts={Highcharts} options={chartOptions} />
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <Paper className={classes.sectionPaper}>
                  <Typography className={classes.sectionTitle}>Detailed Reports Summary</Typography>
                  <TableContainer>
                    <Table className={classes.table}>
                      <TableHead>
                        <TableRow>
                          <TableCell>Report Type</TableCell>
                          <TableCell>Date Range</TableCell>
                          <TableCell>Total Orders</TableCell>
                          <TableCell>Total Revenue</TableCell>
                          <TableCell>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {reports?.map((report) => (
                          <TableRow key={report.id}>
                            <TableCell sx={{ fontWeight: 600 }}>{report.type}</TableCell>
                            <TableCell>{report.dateRange}</TableCell>
                            <TableCell>{report.totalOrders}</TableCell>
                            <TableCell>Rs. {report.totalRevenue.toLocaleString()}</TableCell>
                            <TableCell>
                              <Chip
                                label={report.status}
                                size="small"
                                sx={{
                                  bgcolor: report.status === "Completed" ? "#ecfdf5" : "#fffbeb",
                                  color: report.status === "Completed" ? "#10b981" : "#f59e0b",
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
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Reports;
