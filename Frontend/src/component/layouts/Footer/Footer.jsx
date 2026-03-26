import React from "react";
import { Link } from "react-router-dom";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import "./Footer.css";

const quickLinks = [
  { id: 0, label: "Home", path: "/" },
  { id: 1, label: "Shop", path: "/products" },
  { id: 3, label: "Wishlist", path: "/wishlist" },
  { id: 4, label: "Cart", path: "/cart" },
  { id: 5, label: "Account", path: "/account" },
  { id: 6, label: "About Us", path: "/about" },
];

const supportLinks = [
  { id: 1, label: "Contact Us", path: "/contact" },
  { id: 3, label: "Privacy Policy", path: "/policy/privacy" },
  { id: 4, label: "Terms & Conditions", path: "/terms/conditions" },
];

const socialLinks = [
  {
    id: 1,
    icon: <InstagramIcon className="insta_icon" fontSize="large" />,
    href: "https://www.instagram.com/attic_angels777/?hl=en",
  },
  {
    id: 2,
    icon: <FacebookIcon className="facebook_icon" fontSize="large" />,
    href: "https://www.facebook.com",
  },
  {
    id: 3,
    icon: <MusicNoteIcon className="tiktok_icon" fontSize="large" />,
    href: "https://www.tiktok.com/@attic_angels777",
  },
];

const Footer = () => {
  return (
    <>
      <footer className="footer">
        <div className="container">
          <div className="wrapper_footer footer_wrapper ">
            <div className="foot_about foot1">
              <div className="foot_logo">
                <Link to="/" style={{ textDecoration: "none" }}>
                  <img
                    src={require("../../../Image/Footer/logo.png")}
                    alt="Angels Attic logo"
                  />
                </Link>
              </div>
              <div className="foot_subs">
                <p>
                  Angels Attic is a secure online thrift marketplace where users
                  can buy and sell pre-loved fashion sustainably.
                </p>
              </div>
            </div>

            <div className="foot_menu foot2">
              <h4>Quick Links</h4>
              <ul>
                {quickLinks.map((item) => (
                  <li key={item.id}>
                    <Link to={item.path}>{item.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="foot_menu foot2">
              <h4>Support</h4>
              <ul>
                {supportLinks.map((item) => (
                  <li key={item.id}>
                    <Link to={item.path}>{item.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="foot_menu foot3">
              <h4>Contact</h4>
              <ul>
                <li>
                  <a href="mailto:atticangels777@gmail.com">
                    atticangels777@gmail.com
                  </a>
                </li>
              </ul>
              <div className="foot_social">
                {socialLinks.map((item) => (
                  <a
                    key={item.id}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="separatorFooter"></div>

        <div className="sub_footer_root">
          <div className="container_Footer">
            <div className="sub_footer_wrapper">
              <div className="foot_copyright">
                <p>© 2026 All rights reserved.</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
