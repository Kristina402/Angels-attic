import { makeStyles } from "@material-ui/core/styles";
const useStyles = makeStyles((theme) => ({
  formContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: "7rem",
    paddingBottom: "5rem",
    minHeight: "100vh",
    backgroundColor: "#f8f9fa",
    backgroundImage: "radial-gradient(circle at 2% 10%, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.05) 50%,rgba(72, 72, 72, 0.05) 50%, rgba(72, 72, 72, 0.05) 100%),radial-gradient(circle at 28% 97%, rgba(135, 135, 135, 0.05) 0%, rgba(135, 135, 135, 0.05) 50%,rgba(13, 13, 13, 0.05) 50%, rgba(13, 13, 13, 0.05) 100%),radial-gradient(circle at 67% 68%, rgba(206, 206, 206, 0.05) 0%, rgba(206, 206, 206, 0.05) 50%,rgba(127, 127, 127, 0.05) 50%, rgba(127, 127, 127, 0.05) 100%),linear-gradient(90deg, #fff,#fff)",
  },
  form: {
    width: "100%",
    maxWidth: "450px",
    margin: "auto",
    borderRadius: "24px",
    padding: "3rem",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    backdropFilter: "blur(10px)",
    boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    "&:hover": {
      transform: "translateY(-5px)",
      boxShadow: "0 30px 60px rgba(0,0,0,0.12)",
    },
  },

  heading: {
    textAlign: "center",
    marginBottom: theme.spacing(1),
    color: "#1a1a1a",
    fontWeight: "800",
    letterSpacing: "-0.5px",
  },
  nameInput: {
    width: "100%",
    marginBottom: theme.spacing(2),
    "& .MuiOutlinedInput-root": {
      "&:hover fieldset": { borderColor: "#000" },
      "&.Mui-focused fieldset": { borderColor: "#000" },
    },
    "& .MuiInputLabel-root.Mui-focused": { color: "#000" },
  },
  emailInput: {
    width: "100%",
    marginBottom: theme.spacing(2),
    "& .MuiOutlinedInput-root": {
      "&:hover fieldset": { borderColor: "#000" },
      "&.Mui-focused fieldset": { borderColor: "#000" },
    },
    "& .MuiInputLabel-root.Mui-focused": { color: "#000" },
  },
  passwordInput: {
    width: "100%",
    marginBottom: theme.spacing(2),
    "& .MuiOutlinedInput-root": {
      "& .MuiOutlinedInput-input": { padding: "14px 14px" },
      "&:hover fieldset": { borderColor: "#000" },
      "&.Mui-focused fieldset": { borderColor: "#000" },
    },
    "& .MuiInputLabel-root.Mui-focused": { color: "#000" },
  },

  strengthIndicator: {
    marginTop: theme.spacing(1),
  },

  showPasswordButton: {
    position: "absolute",
    top: "50%",
    color: "rgb(0 0 0 / 85%)",
    fontSize: "12px",
    right: theme.spacing(1),
    transform: "translateY(-50%)",
    border: "none",
    minWidth: "auto",
    padding: "4px 8px",
    "&:hover": {
      color: "#ed1c24",
      background: "none",
    },
  },
  rememberMeContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    marginTop: theme.spacing(2),
    "& .MuiFormControlLabel-root": {
      marginBottom: theme.spacing(1),
    },
    "& .MuiTypography-body1": {
      fontSize: "0.9rem",
      color: "#555",
    },
    "& .MuiIconButton-label": {
      color: "black",
    },
  },
  avatarContainer: {
    display: "flex",
    alignItems: "center",
    gap: "1.5rem",
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: "1rem",
    border: "1px dashed #ccc",
    borderRadius: "10px",
    backgroundColor: "#fafafa",
  },
  avatarPreview: {
    width: "60px",
    height: "60px",
  },
  avatarInput: {
    display: "none",
  },
  uploadButton: {
    textTransform: "none",
    backgroundColor: "#f5f5f5",
    color: "#333",
    "&:hover": {
      backgroundColor: "#e0e0e0",
    },
  },
  forgotPasswordLink: {
    color: "#000",
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
      color: "#ed1c24",
    },
  },
  termsAndConditionsText: {
    fontFamily: "Roboto",
    color: "#727272",
    textAlign: "center",
    lineHeight: "17px",
    paddingLeft: "4px",
    marginTop: theme.spacing(2),
    fontSize: "12px",
  },
  loginButton: {
    color: "#fff",
    backgroundColor: "#000",
    borderRadius: "12px",
    padding: "12px",
    fontWeight: "700",
    textTransform: "none",
    fontSize: "1rem",
    marginTop: "1.5rem",
    "&:disabled": {
      backgroundColor: "#ccc",
      color: "#fff",
    },
    "&:hover": {
      backgroundColor: "#333",
    },
  },
  privacyText: {
    marginLeft: "4px",
    textDecoration: "underline",
    color: "black",
    fontSize: "14px",
    "&:hover": {
      color: "#ed1c24",
    },
  },
  createAccount: {
    fontSize: "1rem",
    fontWeight: 500,
    color: "#121212",
    paddingLeft: "6px",
    "&:hover": {
      color: "#ed1c24",
      textDecoration: "underline",
    },
  },
  // input text Filed
  textField: {
    marginBottom: theme.spacing(2),
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-input": {
      color: "black",
      padding: "12px 14px",
    },
    "& .MuiInputLabel-root": {
      color: "black",
      fontSize: "14px",
      textAlign: "center",
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "black",
      fontSize: "14px",
      textAlign: "center",
    },
    "& .MuiOutlinedInput-root": {
      "&:hover fieldset": {
        borderColor: "black",
        color: "black",
      },
      "& .MuiOutlinedInput-input": {
        padding: "13px 8px",
      },
      "&.Mui-focused fieldset": {
        borderColor: "black",
        color: "black",
        outline: "none",
      },
    },
  },

  // signUp

  avatar: {
    margin: "0 auto 1.5rem",
    backgroundColor: "#1a1a1a",
    width: "64px",
    height: "64px",
    boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
    transition: "transform 0.3s ease",
    "&:hover": {
      transform: "scale(1.1) rotate(5deg)",
    },
  },
  gridcheckbox: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: "3rem",
  },
  checkbox: {
    "& .MuiTypography-body1": {
      fontSize: "14px",
    },
    marginTop: theme.spacing(1),
    "& .MuiIconButton-label": {
      color: "black",
    },
  },

  // image uploader
  root: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: "3.5rem",
  },
  avatar2: {
    marginLeft: "6px",
    backgroundColor: "black",
    "&.MuiAvatar-colorDefault": {
      color: "#fff",
      backgroundColor: "black",
    },
    "&:hover": {
      backgroundColor: "#ed1c24",
    },
  },
  input: {
    display: "none",
  },

  // Update and create product styles ====================>>

  updateProduct: {
    display: "flex",
    alignItems: "flex-start",
    backgroundColor: "#f1f1f1",
    justifyContent: "center",
    width: "100%",
    gap: "1rem",
    overflow: "hidden",
    margin: "-1.1rem 0 0 0",
    padding: 0,
  },
  firstBox1: {
    width: "20%",
    margin: "0rem",
    height: "fit-content",
    backgroundColor: "white",
    borderRadius: "5px",
    boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.5)",
    display: "block",
    [theme.breakpoints.down("999")]: {
      display: "none",
    },
  },

  toggleBox1: {
    width: "16rem",
    margin: "0rem",
    height: "fit-content",
    backgroundColor: "white",
    borderRadius: "5px",
    boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.5)",
    display: "block",
    zIndex: "100",
    position: "absolute",
    top: "58px",
    left: "17px",
  },
  secondBox1: {
    width: "75%",
    backgroundColor: "#f1f1f1",
    height: "fit-content",
    display: "flex",
    flexDirection: "column",
    margin: "-0.5rem 0 0 0",
    gap: "10px",
    justifyContent: "center",
    [theme.breakpoints.down("999")]: {
      width: "100%",
    },
  },
  navBar1: {
    margin: "0rem",
  },

  form2: {
    marginTop: "-6rem",
  },
  uploadAvatarButton: {
    color: "white",
    width: "fit-content",
    backgroundColor: "#414141",
    height: "2.5rem",
    "&:hover": {
      backgroundColor: "#ed1c24",
    },
  },

  uploadAvatarText: {
    fontSize: "14px",
    backgroundColor: "inherit",
    fontWeight: 500,
    color: "#fff",

    padding: "0 1rem",
  },

  imgIcon: {
    width: "auto",
    marginLeft: "1rem",
    alignSelf: "center",
    "& svg": {
      color: "#414141",
      fontSize: "2.5rem !important", 
      boxShadow: `0px 4px 10px rgba(0, 0, 0, 0.3)`,
    },
  },

  descriptionInput: {
    marginTop: theme.spacing(5.5),
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "black",
        color: "black",
      },
      "&:hover fieldset": {
        borderColor: "black",
        color: "black",
      },
      "&.Mui-focused fieldset": {
        borderColor: "black",
        color: "black",
        outline: "none",
      },
    },
    "& .MuiOutlinedInput-input": {
      padding: "13px 8px",
    },
    "& .MuiInputLabel-root": {
      color: "black",
      fontSize: "14px",
      textAlign: "center",
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "black",
      fontSize: "14px",
      textAlign: "center",
    },
  },
  descriptionIcon: {
    marginRight: theme.spacing(1),
    color: theme.palette.text.secondary,
  },
  selectOption: {
    marginTop: theme.spacing(5.5),
    position: "relative",
    width: "100%",
  },

  imageArea: {
    display: "flex",
    gap: "18px",
    width: "90%",
    overflowX: "scroll",
    scrollbarWidth: "10px",
    margin: "2rem 0",
    "&::-webkit-scrollbar": {
      width: "10px",
      height: "5px",
    },
    padding: "3px 16px",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
    borderRadius: theme.shape.borderRadius,
  },
  image: {
    width: "4.5rem ",
    height: "4rem ",
    objectFit: "cover",
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
    borderRadius: theme.shape.borderRadius,
  },
  labelText: {
    color: "#414141",
    fontSize: "14px",
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    left: "14px",
    pointerEvents: "none",
    opacity: (props) => (props.category ? 0 : 1),
    transition: "opacity 0.3s ease",
  },
  formControl: {
    width: "100%",
  },
  select: {
    "& .MuiOutlinedInput-input": {
      padding: "13px 8px",
    },
    "& .MuiInputLabel-outlined": {
      pointerEvents: "none",
      fontSize: "14px",
      textAlign: "center",
      color: "#414141",
    },
    "& .MuiOutlinedInput-root": {
      "&:hover fieldset": {
        borderColor: "#ed1c24",
      },
      "&.Mui-focused fieldset": {
        borderColor: "black",
        outlineColor: "black",
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "black",
      },
    },
    "& .MuiSelect-root": {
      padding: "10px",
      color: "black",
    },
    "& .MuiSelect-icon": {
      marginRight: "-4px",
      color: "gray",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "black",
    },
    "& .MuiMenuItem-root:hover": {
      backgroundColor: "#ed1c24",
      color: "white",
    },
  },

  menu: {
    marginTop: theme.spacing(1),
    "& .MuiMenuItem-root": {
      color: "black",
    },
    "& .MuiMenuItem-root:hover": {
      backgroundColor: "#ed1c24",
      color: "white",
    },
  },
}));

export default useStyles;
