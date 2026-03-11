import React from "react";
import { ReactComponent as LoaderIcon } from "../../../Image/Loader-svg/LoaderBlack.svg";
import "./Loader.css";

const AtticLoader = () => (
  <div className="attic-loader">
    <LoaderIcon className="spinner" />
  </div>
);

export default AtticLoader;
