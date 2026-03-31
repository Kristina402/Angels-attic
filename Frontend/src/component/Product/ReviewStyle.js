import { makeStyles } from "@material-ui/core/styles";


export const useStyles = makeStyles((theme) => ({
  reviewRoot: {
    padding: theme.spacing(2),
    marginTop: "2rem",
    backgroundColor: "white",
    width: "100%",
    overflow: "hidden",
  },
  reviewHeader: {
    margin: "1rem auto",
    textAlign: "center",
    fontWeight: 800,
    fontSize: "2rem !important",
    marginBottom: theme.spacing(2),
    color: "#414141",
  },
  subHeadings: {
    fontSize: "16px",
    color: "#414141",
    fontWeight: 700,
  },
  bodyText: {
    fontSize: "15px",
    color: "#444",
    fontWeight: "600",
    marginBottom: "4px",
  },
  radioText: {
    fontSize: "14px",
    color: "#414141",
  },
  radioButton: {
    color: "#000000",
  },

  submitBtn: {
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600",
    minHeight: "48px",
    padding: "0px 24px",
    width: "100%",
    marginTop: "1.5rem",
    background: "rgb(37, 37, 37)",
    color: "rgb(255, 255, 255)",
    textTransform: "none",
    "&:hover": {
      backgroundColor: "#000",
      transform: "translateY(-2px)",
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    },
    "&:disabled": {
      backgroundColor: "#ccc",
      color: "#666",
    },
  },
  header: {
    fontWeight: "700",
    fontSize: "1.5rem",
    color: "#222",
  },
  ratingContainer: {
    marginTop: "1rem 0",
    display: "inline-block",
    marginRight: theme.spacing(),
  },
  star: {
    color: "black",
    fontSize: 24,
    marginTop: "2px",
  },
  ratingNumber: {
    display: "inline-block",
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1.5),
    fontWeight: "bold",
    fontSize: "1rem",
  },


  selectContainer: {
    textAlign: "right",
    marginTop: "-50px",
    display: "flex",
    flexDirection: "column",
paddingRight:"1.5rem",

},




sortBy: {
  [theme.breakpoints.down("xs")]: {
  visibility: "hidden",
  },

},
  select: {
    "& .MuiSelect-select": {
      paddingTop: "12px",
      paddingBottom: "12px",
      paddingLeft: "10px",
      paddingRight: "35px",
      borderRadius: "6px",
      fontSize: "14px",
      border: "1px solid #252525",
      position: "relative",
      "&:focus": {
        borderRadius: "6px",
        borderColor: "#252525",
      },
    },

    "& .MuiSelect-icon": {
      top: "calc(50% - 12px)",
      right: "12px",
    },
    [theme.breakpoints.down("xs")]: {
      visibility : "hidden",
    },
  },
  menuItem: {
    backgroundColor: "black",
    color: "white",
    "&:hover": {
      backgroundColor: "rgba(222, 9, 9, 0.744)",
    },
    "&.Mui-selected": {
      backgroundColor: "rgba(222, 9, 9, 0.744)",
      color: "white",
    },
  },

  //dialog box

  textField: {
    marginTop: "0.5rem",
    "& .MuiOutlinedInput-root": {
      fontSize: "15px",
      fontWeight: 400,
      color: "#333",
      borderRadius: "8px",
      "& fieldset": {
        borderColor: "#ddd",
      },
      "&:hover fieldset": {
        borderColor: "#999",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#222",
        borderWidth: "1.5px",
      },
    },
  },

  dialog: {
    width: "500px",
    maxWidth: "95vw",
    maxHeight: "90vh",
    margin: "auto",
    padding: "1rem",
    borderRadius: "12px",
    overflow: "hidden",
    [theme.breakpoints.down("xs")]: {
      width: "95vw",
      padding: "0.5rem",
    },
  },
  dialogContent: {
    padding: "1rem 2rem 2rem 2rem",
    overflowY: "auto",
    [theme.breakpoints.down("xs")]: {
      padding: "1rem",
    },
  },
  container: {
    display: "flex",
    flexDirection: "row",
    overflowX: "scroll",
    margin: 10,
    backgroundColor: "#f5f5f5",
    marginTop: "1rem",
    width: "100vw",
    "&::-webkit-scrollbar": {
      width: "0.5em",
      height: "0.5em",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#414141",
      borderRadius: "10px",
    },
    "&::-webkit-scrollbar-track": {
      backgroundColor: "white",
      borderRadius: "10px",
    },
  },
}));
