import React, { useState } from "react";
import {
  Typography,
  Box,
  Button,
  TextField,
  Grid,
  Container,
  CircularProgress,
} from "@mui/material";
import { useAlert } from "react-alert";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import MetaData from "../component/layouts/MataData/MataData";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PhoneInTalkIcon from "@mui/icons-material/PhoneInTalk";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import InstagramIcon from "@mui/icons-material/Instagram";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import MusicNoteIcon from "@mui/icons-material/MusicNote"; // TikTok alternative if TikTokIcon is not available
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  root_contactus: {
    padding: "120px 0 80px",
    backgroundColor: "#F8F8F8",
    minHeight: "100vh",
  },
  headerSection: {
    textAlign: "center",
    marginBottom: "60px",
  },
  title_contact_us: {
    fontSize: "3.5rem !important",
    fontWeight: "800 !important",
    color: "#000000",
    letterSpacing: "-0.02em",
    marginBottom: "16px !important",
    textTransform: "none",
  },
  subtitle_contact_us: {
    fontSize: "1.1rem !important",
    color: "#666666",
    maxWidth: "600px",
    margin: "0 auto !important",
    lineHeight: "1.6 !important",
  },
  contactGrid: {
    marginTop: "40px",
    display: "flex",
    alignItems: "stretch",
  },
  infoSidebar: {
    paddingRight: "40px",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    [theme.breakpoints.down("md")]: {
      paddingRight: "0",
      marginBottom: "60px",
    },
  },
  infoCard_contact: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    marginBottom: "24px",
    padding: "24px",
    backgroundColor: "#FFFFFF",
    borderRadius: "16px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    "&:hover": {
      transform: "translateY(-5px)",
      boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    },
  },
  iconWrapper: {
    width: "56px",
    height: "56px",
    borderRadius: "50%",
    backgroundColor: "#000000",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#FFFFFF",
    flexShrink: 0,
  },
  infoLabel_contact: {
    fontSize: "0.85rem !important",
    fontWeight: "700 !important",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    color: "#999999",
    marginBottom: "4px !important",
  },
  infoValue_contact: {
    fontSize: "1.1rem !important",
    color: "#000000",
    fontWeight: "600 !important",
    lineHeight: "1.4 !important",
  },
  formWrapper: {
    backgroundColor: "#ffffff",
    padding: "40px",
    borderRadius: "24px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
    border: "1px solid #f0f0f0",
    height: "100%",
    [theme.breakpoints.down("sm")]: {
      padding: "30px",
    },
  },
  formTitle: {
    fontSize: "1.8rem !important",
    fontWeight: "700 !important",
    marginBottom: "32px !important",
    letterSpacing: "-0.01em",
  },
  textField: {
    marginBottom: "24px !important",
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      backgroundColor: "#ffffff",
      "& fieldset": {
        borderColor: "#E0E0E0",
      },
      "&:hover fieldset": {
        borderColor: "#000000",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#000000",
        borderWidth: "2px",
      },
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "#000000",
    },
  },
  submitButtons: {
    backgroundColor: "#000000 !important",
    color: "#ffffff !important",
    padding: "16px 40px !important",
    borderRadius: "12px !important",
    fontSize: "1rem !important",
    fontWeight: "600 !important",
    textTransform: "none !important",
    width: "100%",
    marginTop: "8px !important",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1) !important",
    transition: "all 0.3s ease !important",
    "&:hover": {
      backgroundColor: "#333333 !important",
      transform: "translateY(-2px)",
      boxShadow: "0 10px 20px rgba(0,0,0,0.15) !important",
    },
  },
  socialLinks: {
    display: "flex",
    gap: "16px",
    marginTop: "20px",
  },
  socialIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    backgroundColor: "#FFFFFF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#000000",
    textDecoration: "none",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
    border: "1px solid #eeeeee",
    "&:hover": {
      backgroundColor: "#000000",
      color: "#ffffff",
      transform: "translateY(-3px)",
      boxShadow: "0 8px 15px rgba(0,0,0,0.1)",
    },
  },
  mapSection: {
    marginTop: "80px",
    borderRadius: "24px",
    overflow: "hidden",
    boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
    border: "1px solid #f0f0f0",
  },
  mapFrame_contact: {
    border: 0,
    width: "100%",
    height: "550px",
    display: "block",
  },
}));

const ContactForm = () => {
  const classes = useStyles();
  const alert = useAlert();
  const history = useHistory();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCall = () => {
    window.location.href = "tel:+9826125791";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/v1/contact",
        { name, email, subject, message },
        config
      );

      if (data.success) {
        alert.success(data.message);
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
        history.push("/");
      }
    } catch (error) {
      alert.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className={classes.root_contactus}>
      <MetaData title={"Contact Us"} />
      <Container maxWidth="lg">
        {/* Header Section */}
        <Box className={classes.headerSection}>
          <Typography variant="h1" className={classes.title_contact_us}>
            Get in touch
          </Typography>
          <Typography className={classes.subtitle_contact_us}>
            Have a question or just want to say hi? We'd love to hear from you.
            Our team is here to help you.
          </Typography>
        </Box>

        <Grid container className={classes.contactGrid}>
          {/* Info Section */}
          <Grid item xs={12} md={5}>
            <Box className={classes.infoSidebar}>
              <Box className={classes.infoCard_contact}>
                <Box className={classes.iconWrapper}>
                  <LocationOnIcon fontSize="large" />
                </Box>
                <Box>
                  <Typography className={classes.infoLabel_contact}>Address</Typography>
                  <Typography className={classes.infoValue_contact}>
                    Pokhara, Nepal
                  </Typography>
                </Box>
              </Box>

              <Box className={classes.infoCard_contact}>
                <Box className={classes.iconWrapper}>
                  <PhoneInTalkIcon fontSize="large" />
                </Box>
                <Box>
                  <Typography className={classes.infoLabel_contact}>Phone</Typography>
                  <Typography
                    className={classes.infoValue_contact}
                    onClick={handleCall}
                    style={{ cursor: "pointer", textDecoration: "underline" }}
                  >
                    +977 9826125791
                  </Typography>
                </Box>
              </Box>

              <Box className={classes.infoCard_contact}>
                <Box className={classes.iconWrapper}>
                  <MailOutlineIcon fontSize="large" />
                </Box>
                <Box>
                  <Typography className={classes.infoLabel_contact}>Email</Typography>
                  <Typography className={classes.infoValue_contact}>
                    atticangels777@gmail.com
                  </Typography>
                </Box>
              </Box>

              <Box style={{ marginTop: "60px" }}>
                <Typography className={classes.infoLabel_contact}>Follow Us</Typography>
                <Box className={classes.socialLinks}>
                  <a
                    href="https://www.instagram.com/attic_angels777/?hl=en"
                    target="_blank"
                    rel="noreferrer"
                    className={classes.socialIcon}
                  >
                    <InstagramIcon fontSize="small" />
                  </a>
                  <a
                    href="https://wa.me/9826125791"
                    target="_blank"
                    rel="noreferrer"
                    className={classes.socialIcon}
                  >
                    <WhatsAppIcon fontSize="small" />
                  </a>
                  <a
                    href="https://www.tiktok.com/@attic_angels777"
                    target="_blank"
                    rel="noreferrer"
                    className={classes.socialIcon}
                  >
                    <MusicNoteIcon fontSize="small" />
                  </a>
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Form Section */}
          <Grid item xs={12} md={7}>
            <Box className={classes.formWrapper}>
              <Typography className={classes.formTitle}>Send us a message</Typography>
              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Full Name"
                  variant="outlined"
                  className={classes.textField}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  variant="outlined"
                  className={classes.textField}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <TextField
                  fullWidth
                  label="Subject"
                  variant="outlined"
                  className={classes.textField}
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                />
                <TextField
                  fullWidth
                  label="Message"
                  multiline
                  rows={4}
                  variant="outlined"
                  className={classes.textField}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
                <Button
                  type="submit"
                  variant="contained"
                  className={classes.submitButtons}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : "Send Message"}
                </Button>
              </form>
            </Box>
          </Grid>
        </Grid>

        {/* Map Section */}
        <Box className={classes.mapSection}>
          <iframe
            title="Angels Attic - Pokhara, Nepal"
            className={classes.mapFrame_contact}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3520.548622005869!2d83.98559341506507!3d28.209583682598487!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3995937d2b3f1b9f%3A0x9c0d2d3f2d3a0f3!2sPokhara%2C%20Nepal!5e0!3m2!1sen!2snp!4v1700000000000"
          />
        </Box>
      </Container>
    </Box>
  );
};

export default ContactForm;
