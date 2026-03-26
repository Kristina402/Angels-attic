import React from "react";
import { Typography, Container, Grid, Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import MetaData from "../component/layouts/MataData/MataData";
import TermsImage from "../Image/about/tc.png";
import { Link } from "react-router-dom";
const useStyles = makeStyles((theme) => ({
  about_us: {
    paddingTop: "10rem",
    paddingBottom: "6rem",
    backgroundColor: "white !important",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: "5rem",
    paddingRight: "5rem",
    [theme.breakpoints.down("md")]: {
      paddingLeft: "2rem",
      paddingRight: "2rem",
      paddingTop: "8rem",
    },
  },

  container_12: {
    padding: "3rem 0",
    textAlign: "center",
    backgroundColor: "white !important",
    maxWidth: "1200px !important",
    margin: "0 auto",
  },
  image_about: {
    width: "100%",
    height: "auto",
    borderRadius: "15px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  },
  title_about: {
    color: "#111827",
    fontSize: "2.5rem !important",
    padding: "0 0 1.5rem 0",
    fontFamily: "Archivo !important",
    fontWeight: "800 !important",
    textAlign: "left",
    [theme.breakpoints.down("sm")]: {
      textAlign: "center",
      fontSize: "2rem !important",
    },
  },
  heading12_about: {
    fontSize: "2rem !important",
    padding: "0 0 1.5rem 0",
    fontWeight: "700 !important",
    color: "#111827",
    textAlign: "center",
    fontFamily: "Archivo !important",
  },
  introText_about: {
    maxWidth: "100%",
    lineHeight: "1.8",
    margin: "0 0 1.5rem 0",
    color: "#4b5563",
    fontSize: "1.1rem !important",
    fontWeight: "400 !important",
    textAlign: "left",
    fontFamily: "Roboto !important",
    [theme.breakpoints.down("sm")]: {
      textAlign: "center",
    },
  },
  infoText_about: {
    lineHeight: "1.8",
    margin: "0 auto 1.5rem",
    color: "#4b5563",
    fontSize: "1.1rem !important",
    fontWeight: "400 !important",
    textAlign: "center",
    maxWidth: "900px",
    fontFamily: "Roboto !important",
  },
  buttonContainer_about: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "2rem 0 0 0",
    width: "100%",
    gap: "1.5rem",
  },
  button1_about: {
    backgroundColor: "#000000 !important",
    color: "white !important",
    padding: "1rem 2.5rem !important",
    borderRadius: "999px !important",
    textTransform: "none !important",
    fontWeight: "600 !important",
    fontSize: "1rem !important",
    transition: "all 0.3s ease !important",
    "&:hover": {
      backgroundColor: "#333333 !important",
      transform: "translateY(-2px)",
      boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
    },
  },
}));

const About_UsPage = () => {
  const classes = useStyles();

  return (
    <>
      <div className={classes.about_us}>
        <MetaData title={"About Us"} />
        <Container className={classes.container_12}>
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} sm={6}>
              <img
                src={TermsImage}
                alt="Angels Attic marketplace"
                className={classes.image_about}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="h2"
                component="h1"
                className={classes.title_about}
              >
                About Us
              </Typography>
              <Typography variant="body1" className={classes.introText_about}>
                Angels Attic is a web-based thrift marketplace
                that connects buyers and sellers of quality pre-owned items
                in a secure, user-friendly environment. The platform is
                designed to promote sustainable shopping by extending the
                lifecycle of fashion, accessories, and lifestyle products
                instead of sending them to landfills.
              </Typography>
              <Typography variant="body1" className={classes.introText_about}>
                Built as a structured marketplace, Angels Attic supports
                multiple user roles, including buyers, individual sellers,
                and administrators. Sellers can list authenticated, good
                condition items, while buyers enjoy curated discovery,
                transparent pricing, and a modern e-commerce experience
                powered by the MERN stack.
              </Typography>
            </Grid>
          </Grid>
        </Container>
        <Container className={classes.container_12}>
          <Typography
            variant="h3"
            component="h1"
            className={classes.heading12_about}
          >
            Who We Are
          </Typography>
          <Typography variant="body1" className={classes.infoText_about}>
            Angels Attic is focused on making circular fashion accessible
            and practical. The marketplace is designed for people who want
            to refresh their wardrobe or home while staying budget-conscious
            and environmentally responsible. Listings highlight product
            condition and details so buyers can make informed decisions.
          </Typography>
          <Typography variant="body1" className={classes.infoText_about}>
            Since its inception, Angels Attic has been built around trust,
            transparency, and community. The platform experience combines
            familiar e-commerce flows with the unique value of resale, giving
            users a reliable place to buy and sell pre-owned items online.
          </Typography>
        </Container>
        <Container className={classes.container_12}>
          <Typography
            variant="h3"
            component="h1"
            className={classes.heading12_about}
          >
            Our Mission
          </Typography>
          <Typography variant="body1" className={classes.infoText_about}>
            The mission of Angels Attic is to make sustainable shopping a
            default choice by providing a seamless thrift marketplace for
            everyday users. The platform encourages people to resell items
            they no longer use and discover pieces they will love, reducing
            waste and supporting a circular economy.
          </Typography>
          <Typography variant="body1" className={classes.infoText_about}>
            Product categories span women’s wear, men’s wear, accessories,
            vintage pieces, and footwear, with scope to include more
            lifestyle items over time. As a final year project, Angels Attic
            demonstrates how modern web technologies can support real-world
            sustainable commerce.
          </Typography>

          <div className={classes.buttonContainer_about}>
            <Link
              to="/products"
              style={{ textDecoration: "none", color: "none" }}
            >
              <Button variant="contained" className={classes.button1_about}>
                Our Products
              </Button>
            </Link>
          </div>
        </Container>
      </div>
    </>
  );
};

export default About_UsPage;
