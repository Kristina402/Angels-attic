import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { Stepper, Step, StepLabel, StepConnector, Box, Typography } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    backgroundColor: "transparent",
    padding: "2rem 0",
  },
  stepLabel: {
    "& .MuiStepLabel-label": {
      marginTop: "10px",
      fontSize: "12px",
      fontWeight: 600,
      color: "#999",
      letterSpacing: "1px",
      textTransform: "uppercase",
      [theme.breakpoints.down("xs")]: {
        fontSize: "10px",
      },
    },
    "& .MuiStepLabel-active": {
      color: "#000 !important",
    },
    "& .MuiStepLabel-completed": {
      color: "#000 !important",
    },
  },
}));

const ColorlibConnector = withStyles({
  alternativeLabel: {
    top: 22,
  },
  active: {
    "& $line": {
      backgroundColor: "#000",
    },
  },
  completed: {
    "& $line": {
      backgroundColor: "#000",
    },
  },
  line: {
    height: 2,
    border: 0,
    backgroundColor: "#eaeaea",
    borderRadius: 1,
  },
})(StepConnector);

const useColorlibStepIconStyles = makeStyles({
  root: {
    backgroundColor: "#fff",
    zIndex: 1,
    color: "#ccc",
    width: 45,
    height: 45,
    display: "flex",
    borderRadius: "50%",
    justifyContent: "center",
    alignItems: "center",
    border: "2px solid #eaeaea",
    transition: "all 0.3s ease",
    [theme => theme.breakpoints.down("xs")]: {
      width: 35,
      height: 35,
    },
  },
  active: {
    color: "#000",
    borderColor: "#000",
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
    transform: "scale(1.1)",
  },
  completed: {
    color: "#fff",
    backgroundColor: "#000",
    borderColor: "#000",
  },
});

function ColorlibStepIcon(props) {
  const classes = useColorlibStepIconStyles();
  const { active, completed } = props;

  const icons = {
    1: <ShoppingBagOutlinedIcon style={{ fontSize: "20px" }} />,
    2: <LocalShippingOutlinedIcon style={{ fontSize: "20px" }} />,
    3: <AccountBalanceWalletOutlinedIcon style={{ fontSize: "20px" }} />,
    4: <CheckCircleOutlineOutlinedIcon style={{ fontSize: "20px" }} />,
  };

  return (
    <div
      className={`${classes.root} ${active ? classes.active : ""} ${completed ? classes.completed : ""}`}
    >
      {icons[String(props.icon)]}
    </div>
  );
}

const CheckoutSteps = ({ activeStep }) => {
  const classes = useStyles();
  const history = useHistory();

  const steps = [
    { label: "Bag", link: "/cart" },
    { label: "Delivery", link: "/shipping" },
    { label: "Payment", link: "/process/payment" },
    { label: "Order Complete", link: "/success" },
  ];

  return (
    <Box className={classes.root}>
      <Stepper 
        alternativeLabel 
        activeStep={activeStep} 
        connector={<ColorlibConnector />}
        style={{ backgroundColor: "transparent" }}
      >
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel 
              StepIconComponent={ColorlibStepIcon}
              className={classes.stepLabel}
              onClick={() => index < activeStep && history.push(step.link)}
              style={{ cursor: index < activeStep ? "pointer" : "default" }}
            >
              {step.label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export default CheckoutSteps;
