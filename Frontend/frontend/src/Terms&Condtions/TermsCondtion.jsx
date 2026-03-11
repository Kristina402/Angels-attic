import React from "react";
import "./TermsAndCondtion.css";
import MetaData from "../component/layouts/MataData/MataData";
import TermsImage from "../Image/about/tc.png";
const TermsAndConditionsPage = () => {
  return (
    <div className="terms-container">
      <MetaData title="Terms and Conditions" />
      <img
        src={TermsImage}
        alt="Terms and Conditions"
        className="terms-image"
      />
      <div className="terms-overlay">
        <h1 className="terms-title">TERMS AND CONDITIONS</h1>
      </div>
      <div className="terms-content">
        <p>
          Thank you for using Angels Attic. We appreciate your trust in our
          thrift marketplace and your interest in sustainable, pre-owned
          products. We want to make sure you have a good experience buying and
          selling through our website.
        </p>
        <p>
          By placing an order and purchasing a product from our website, you
          agree to the following terms and conditions, along with our return and
          warranty policies, privacy policy, and terms of use. Please review
          everything fully and carefully so you are informed about your rights
          and obligations.
        </p>
        <h2>Acceptance of These Terms</h2>
        <p>
          You (“Customer”) may place orders for products listed on Angels Attic
          ("we," "our") via our website. By placing an order, you consent to
          these Terms and Conditions of Sale (“Terms”) and acknowledge that we
          will facilitate the transaction subject to these Terms. Any term or
          condition in any order or correspondence that is inconsistent with
          these Terms shall be inapplicable and of no force and effect
          whatsoever, unless expressly agreed to in writing by Angels Attic.
        </p>
        <h2>Orders</h2>
        <p>
          All orders are subject to Angels Attic’s acceptance. We may refuse to
          accept, cancel, or limit any order or order quantity for any reason,
          even after an order confirmation has been sent. If we cancel an order
          after you have been charged, we will refund you the charged amount.
        </p>
        <h2>Product Offering</h2>
        <p>
          All product descriptions on our website are subject to change without
          notice at our sole discretion. We reserve the right to change or
          discontinue a product at any time. While we make every effort to
          display the colors and images of the products accurately, we cannot
          guarantee that your device's display will be an exact reflection of
          the physical item.
        </p>
        <h2>Price</h2>
        <p>
          All prices are subject to change until your order is accepted by
          Angels Attic. Prices displayed on the website exclude shipping
          charges, which are calculated and displayed based on the selected
          shipping option during checkout. Where third-party sellers list
          products, pricing is determined by the seller and may vary over time.
          We reserve the right to correct pricing errors and notify you of any
          changes before proceeding with your order.
        </p>
        <h2>Special Offers</h2>
        <p>
          From time to time, we may offer special promotions, including
          discounts, limited edition products, or free shipping. These offers
          are subject to change or discontinuation at any time.
        </p>
        <h2>Taxes</h2>
        <p>
          Applicable taxes, if any, may be included in or added to the price at
          checkout in accordance with local regulations. The customer is
          responsible for paying any taxes, except for those based on Angels
          Attic’s income. If Angels Attic is required to collect and pay taxes
          on the customer’s behalf, we may invoice the customer for those
          amounts.
        </p>
        <h2>Payment</h2>
        <p>
          All orders must be paid in full before shipment. We accept payment
          through MasterCard and Visa. Payment information is submitted upon
          placing an order and is subject to verification and availability of
          funds.
        </p>
        <h2>Shipping</h2>
        <p>
          Available shipping options will be displayed during the checkout
          process. Any shipping timeframes provided are estimates, and we cannot
          guarantee exact delivery dates. We are not liable for late deliveries,
          but if you no longer need an item due to a late delivery, please
          contact our Customer Service Department. Refer to our return policy
          for available options. All risk of loss or damage to the products
          passes to you upon taking physical possession, and title passes to you
          when the products are picked up by the shipping carrier.
        </p>
        <h2>Returns</h2>
        <p>
          Once an order has been placed and accepted, you may not cancel the
          order without Angels Attic’s consent. You may return eligible products
          for a refund of the purchase price (excluding initial shipping
          charges) plus any applicable tax, in accordance with our return
          policy. Return shipping expenses are typically the customer's
          responsibility. Products must be returned within the timeframe stated
          in the listing or in our return policy.
        </p>
        <h2>Warranty</h2>
        <p>
          For warranty information, please refer to the written warranty
          included with the product or the warranty page on our website.
        </p>
        <h2>Not for Resale</h2>
        <p>
          Products sold on our website are for end-user customers only and not
          for resale. We reserve the right to refuse or cancel any order if we
          suspect products are being purchased for resale.
        </p>
        <h2>Governing Law / Jurisdiction</h2>
        <p>
          These Terms shall be governed and construed in accordance with the
          laws of Singapore.
        </p>
        <h2>Dispute Resolution and Applicable Law</h2>
        <p>
          Any disputes arising from or relating to these Terms shall be resolved
          through arbitration in Singapore, administered by the Singapore
          International Arbitration Centre (SIAC), in accordance with the
          Arbitration Rules of the SIAC. The language of the arbitration shall
          be English.
        </p>
        <h2>Indemnification</h2>
        <p>
          You agree to indemnify and hold Angels Attic harmless from any
          claims, costs, proceedings, losses, or demands arising from your
          breach of these Terms or anyone using your account.
        </p>
        <h2>Entire Agreement</h2>
        <p>
          These Terms constitute the entire agreement between Angels Attic and
          the customer, superseding all prior or contemporaneous agreements,
          representations, warranties, and understandings.
        </p>
        <h2>Severability</h2>
        <p>
          If any provision of these Terms is held to be invalid or
          unenforceable, the remaining provisions shall remain in full force and
          effect, and the invalid or unenforceable provision shall be
          interpreted to give maximum effect to the intent of the parties.
        </p>
        <h2>Exclusivity</h2>
        <p>
          The rights, liabilities, responsibilities, and remedies with respect
          to the Products are exclusively those expressed in these Terms. The
          waivers, releases, limitations on liability, and remedies expressed in
          these Terms apply even in the event of default, negligence, breach of
          contract, strict liability, or other cause of action.
        </p>
      </div>
    </div>
  );
};

export default TermsAndConditionsPage;
