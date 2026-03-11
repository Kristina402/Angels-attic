import React from "react";
import { Link } from "react-router-dom";
import "./Return.css"
import MetaData from "../component/layouts/MataData/MataData";
import TermsImage from "../Image/about/tc.png";
const ReturnPolicyPage = () => {
  return (
    <div className="container__0">
      <MetaData title="Return Policy" />
      <div className="image-container">
        <img
          src={TermsImage}
          alt="Background"
        />
        <h1 className="policy-text">RETURN POLICY</h1>
      </div>
      <div className="content-container">
        <p>
          Thank you for shopping with Angels Attic. We want every experience on
          our thrift marketplace to be positive. If you are not completely
          satisfied with a purchase, eligible items can be returned within 7–30
          days depending on the listing and category.
        </p>
        <p>
          To be eligible for a return, the item must be in the condition
          described on the listing, with any major defects disclosed, and must
          include all essential components. You will also need to provide proof
          of purchase. Certain items, such as intimate wear or heavily used
          products, may not be eligible for return unless there is a clear
          defect or an error in the listing.
        </p>
        <p>
          If you would like to initiate a return, please contact our Customer
          Service Department within the specified return period. Our team will
          guide you through the return process and provide you with the
          necessary instructions and return address.
        </p>
        <p>
          Once we receive your returned item and verify its condition, we will
          process the refund to the original payment method used for the
          purchase. Please allow a few working days for the refund to be
          reflected in your account.
        </p>
        <p>
          Return shipping costs are usually the responsibility of the buyer,
          unless the return is due to a defect, damage, or incorrect item
          received. We recommend using a trackable shipping method to ensure the
          safe and timely delivery of your return.
        </p>
        <p>
          If you have any questions or need further assistance regarding our
          return policy, please feel free to contact our Customer Service
          Department. We are here to help!
        </p>
        <h2>Contact Information:</h2>
        <p>
          Angels Attic Support
          <br />
          <span style={{ fontWeight: "500" }}>Email </span>:
          support@angelsattic.com
          <br />
          <span style={{ fontWeight: "500" }}>Phone  </span>:  123-456-7890
          <br />
      <span style={{ fontWeight: "500" }}>    Hours of Operation: Monday to Friday, 9:00 AM to 5:00 PM (GMT) </span>
        </p>
        <p>
          Please reach out to us if you have any concerns or require any
          clarifications regarding our{" "}
          <Link
            to="/policy/return"
            style={{
              textDecoration: "none",
              color: "inherit",
              fontWeight: "500",
            }}
          >
            return policy
          </Link>
          . We strive to provide excellent customer service and ensure your
          satisfaction.
        </p>
      </div>
    </div>
  );
};

export default ReturnPolicyPage;
