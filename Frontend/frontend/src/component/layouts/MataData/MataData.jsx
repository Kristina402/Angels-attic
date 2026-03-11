import React from "react";
import Helmet from "react-helmet";
function MataData({ title }) {
  const baseTitle = "Angels Attic \u2013 Online Thrift Marketplace";
  const fullTitle = title ? `${title} | ${baseTitle}` : baseTitle;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta
        name="description"
        content="Angels Attic is a web-based thrift marketplace where buyers and sellers trade quality pre-owned fashion, accessories, and lifestyle products in a sustainable way."
      />
    </Helmet>
  );
}

export default MataData
