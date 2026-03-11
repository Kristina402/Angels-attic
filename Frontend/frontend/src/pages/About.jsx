import React from "react";
import MetaData from "../component/layouts/MataData/MataData";
import { motion } from "framer-motion";

const about1 = require("../Image/about/about1.png");
const about2 = require("../Image/about/about2.png");

const About = () => {
  return (
    <div className="about_page_hubspot">
      <MetaData title="About Us - Angels Attic" />

      <div className="about_container_hubspot">
        {/* Hero Section: Text Left, Image Right */}
        <section className="about_hero_hubspot">
          <motion.div 
            className="hero_text_hubspot"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="hero_title_hubspot">About Us</h1>
            <p className="hero_para_hubspot">
              Angels Attic is a modern thrift fashion marketplace where pre-loved,
              vintage, and sustainable pieces find a new home. We connect buyers
              and sellers who believe in affordable style with a lighter
              footprint.
            </p>
          </motion.div>
          <motion.div 
            className="hero_image_hubspot"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <img src={about1} alt="About Angels Attic" className="hubspot_img" />
          </motion.div>
        </section>

        {/* Mission Section: Image Left, Text Right */}
        <section className="about_mission_hubspot">
          <motion.div 
            className="mission_image_hubspot"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <img src={about2} alt="Our Mission" className="hubspot_img" />
          </motion.div>
          <motion.div 
            className="mission_text_hubspot"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="section_heading_hubspot">Our Mission</h2>
            <p className="section_para_hubspot">
              Our mission is to inspire sustainable shopping by making it simple,
              rewarding, and beautiful. Angels Attic helps reduce textile waste,
              supports independent sellers, and nurtures a fashion community built
              around affordable, meaningful style that feels good to wear and
              better for the planet.
            </p>
          </motion.div>
        </section>

        {/* Vision Section: Text Left, Placeholder/Icon Right (Optional) or just centered */}
        <section className="about_vision_hubspot">
          <motion.div 
            className="vision_content_hubspot"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="section_heading_hubspot">Our Vision</h2>
            <p className="section_para_hubspot">
              To become the leading platform for sustainable fashion, where every purchase supports 
              a circular economy. We envision a world where style and ethics coexist seamlessly, 
              empowering individuals to express themselves through thoughtful, pre-loved fashion.
            </p>
          </motion.div>
        </section>
      </div>
    </div>
  );
};

export default About;
