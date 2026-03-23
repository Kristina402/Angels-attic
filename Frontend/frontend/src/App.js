import React, { useState, useEffect, Suspense } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { load_UserProfile } from "./actions/userAction";
import axios from "axios";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CricketBallLoader from "./component/layouts/loader/Loader";
import PrivateRoute, { AdminRoute, VendorRoute, PublicRoute } from "./component/Route/PrivateRoute";
import { SpeedInsights } from '@vercel/speed-insights/react';
import "./App.css";

import Header from "./component/layouts/Header1.jsx/Header";
import Payment from "./component/Cart/Payment";
import Home from "./component/Home/Home";
import Footer from "./component/layouts/Footer/Footer";
import ProductDetails from "./component/Product/ProductDetails";
import Products from "./component/Product/Products";
import Signup from "./component/User/SignUp";
import Login from "./component/User/Login";
import Profile from "./component/User/Profile";
import UpdateProfile from "./component/User/UpdateProfile";
import UpdatePassword from "./component/User/UpdatePassword";
import ForgetPassword from "./component/User/ForgetPassword";
import ResetPassword from "./component/User/ResetPassword";
import Shipping from "./component/Cart/Shipping";
import Cart from "./component/Cart/Cart";
import Checkout from "./component/Cart/Checkout";
import Wishlist from "./component/Cart/Wishlist";
import ConfirmOrder from "./component/Cart/ConfirmOrder";
import OrderSuccess from "./component/Cart/OrderSuccess";
import MyOrder from "./component/order/MyOrder";
import ContactForm from "./Terms&Condtions/Contact";
import About from "./pages/About";
import ReturnPolicyPage from "./Terms&Condtions/Return";
import TermsUse from "./Terms&Condtions/TermsAndUse";
import TermsAndConditions from "./Terms&Condtions/TermsCondtion";
import PrivacyPolicy from "./Terms&Condtions/Privacy";
import VendorRegistration from "./component/User/VendorRegistration";
import VendorDashboard from "./component/Vendor/Dashboard";
import VendorSettings from "./component/Vendor/VendorSettings";
import VendorProductList from "./component/Vendor/ProductList";
import VendorOrderList from "./component/Vendor/OrderList";
import PendingApproval from "./component/Vendor/PendingApproval";
import SalesAnalytics from "./component/Vendor/SalesAnalytics";
// const LazyPayment = React.lazy(() => import("./component/Cart/Payment"));
const LazyDashboard = React.lazy(() => import("./component/Admin/Dashboard"));
const VendorNewProduct = React.lazy(() =>
  import("./component/Vendor/NewProduct")
);
const VendorUpdateProduct = React.lazy(() =>
  import("./component/Vendor/UpdateProduct")
);
const LazyProductList = React.lazy(() =>
  import("./component/Admin/ProductList")
);
const LazyOrderList = React.lazy(() => import("./component/Admin/OrderList"));
const LazyUserList = React.lazy(() => import("./component/Admin/UserList"));
const LazyVendorList = React.lazy(() =>
  import("./component/Admin/VendorList")
);
const LazyUpdateProduct = React.lazy(() =>
  import("./component/Admin/UpdateProduct")
);
const LazyProcessOrder = React.lazy(() =>
  import("./component/Admin/ProcessOrder")
);
const LazyUpdateUser = React.lazy(() => import("./component/Admin/UpdateUser"));
const LazyNewProduct = React.lazy(() => import("./component/Admin/NewProduct"));
const LazyProductReviews = React.lazy(() =>
  import("./component/Admin/ProductReviews")
);
const LazySalesAnalysis = React.lazy(() =>
  import("./component/Admin/SalesAnalysis")
);
const LazyReports = React.lazy(() =>
  import("./component/Admin/Reports")
);
const LazySettings = React.lazy(() =>
  import("./component/Admin/Settings")
);

function App() {
  const [stripeApiKey, setStripeApiKey] = useState("");
  const [stripePromise, setStripePromise] = useState(null);

  const dispatch = useDispatch();

  // get STRIPE_API_KEY for payment from backend for connection to stripe payment gateway
  async function getStripeApiKey() {
    try {
      const { data } = await axios.get("/api/v1/stripeapikey");
      if (
        data &&
        data.stripeApiKey !== undefined &&
        data.stripeApiKey !== null &&
        data.stripeApiKey !== ""
      ) {
        sessionStorage.setItem(
          "stripeApiKey",
          JSON.stringify(data.stripeApiKey)
        );
        setStripeApiKey(data.stripeApiKey);
        setStripePromise(loadStripe(data.stripeApiKey));
      }
    } catch (error) {
      // Handle error if the API call fails
      console.error("Error fetching Stripe API key:", error);
    }
  }

  useEffect(() => {
    const savedApiKey = sessionStorage.getItem("stripeApiKey");
    if (savedApiKey) {
      const key = JSON.parse(savedApiKey);
      setStripeApiKey(key);
      setStripePromise(loadStripe(key));
    } else {
      getStripeApiKey();
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    dispatch(load_UserProfile());

    // eslint-disable-next-line
  }, []);

  const { user, isAuthenticated } = useSelector((state) => state.userData);

  return (
    <>
      <SpeedInsights />
      <Suspense fallback={<CricketBallLoader />}>
        <Switch>
          <PublicRoute
            exact
            path="/"
            render={() => (
              <>
                <Header />
                <Home />
                <Footer />
              </>
            )}
          />

          <PublicRoute
            exact
            path="/product/:id"
            render={() => (
              <>
                {<Header />}
                <ProductDetails />
                {<Footer />}
              </>
            )}
          />

          <PublicRoute
            exact
            path="/products"
            render={() => (
              <>
                {<Header />}
                <Products />
                {<Footer />}
              </>
            )}
          />

          <PublicRoute
            path="/products/:keyword"
            render={() => (
              <>
                {<Header />}
                <Products />
                {<Footer />}
              </>
            )}
          />

          <PublicRoute
            exact
            path="/signup"
            render={() => (
              <>
                {<Header />}
                <Signup />
                {<Footer />}
              </>
            )}
          />

          <PublicRoute
            exact
            path="/vendor/register"
            render={() => (
              <>
                {<Header />}
                <VendorRegistration />
                {<Footer />}
              </>
            )}
          />

          <PublicRoute
            exact
            path="/login"
            render={() => (
              <>
                {<Header />}
                <Login />
                {<Footer />}
              </>
            )}
          />

          <PublicRoute
            exact
            path="/password/forgot"
            render={() => (
              <>
                {<Header />}
                <ForgetPassword />
                {<Footer />}
              </>
            )}
          />

          <PublicRoute
            exact
            path="/password/reset/:token"
            render={() => (
              <>
                {<Header />}
                <ResetPassword />
                {<Footer />}
              </>
            )}
          />

          <PrivateRoute
            exact
            path="/cart"
            render={() => (
              <>
                {<Header />}
                <Cart />
                {<Footer />}
              </>
            )}
          />

          <PrivateRoute
            exact
            path="/wishlist"
            render={() => (
              <>
                {<Header />}
                <Wishlist />
                {<Footer />}
              </>
            )}
          />

          <PublicRoute
            exact
            path="/policy/return"
            render={() => (
              <>
                {<Header />}
                <ReturnPolicyPage />
                {<Footer />}
              </>
            )}
          />

          <PublicRoute
            exact
            path="/policy/Terms"
            render={() => (
              <>
                {<Header />}
                <TermsUse />
                {<Footer />}
              </>
            )}
          />

          <PublicRoute
            exact
            path="/policy/privacy"
            render={() => (
              <>
                {<Header />}
                <PrivacyPolicy />
                {<Footer />}
              </>
            )}
          />

          <PublicRoute
            exact
            path="/terms/conditions"
            render={() => (
              <>
                {<Header />}
                <TermsAndConditions />
                {<Footer />}
              </>
            )}
          />

          <PublicRoute
            exact
            path="/contact"
            render={() => (
              <>
                {<Header />}
                <ContactForm />

                {<Footer />}
              </>
            )}
          />

          <PublicRoute
            exact
            path="/about"
            render={() => (
              <>
                {<Header />}
                <About />
                {<Footer />}
              </>
            )}
          />


          <Route
            exact
            path="/vendor/pending"
            component={PendingApproval}
          />

          <Route
            exact
            path="/account"
            render={() => (
              <>
                {<Header />}
                <PrivateRoute exact path="/account" component={Profile} />
                {<Footer />}
              </>
            )}
          />

          <Route
            exact
            path="/profile/update"
            render={() => (
              <>
                {<Header />}
                <PrivateRoute
                  exact
                  path="/profile/update"
                  component={UpdateProfile}
                />
                {<Footer />}
              </>
            )}
          />

          <Route
            exact
            path="/password/update"
            render={() => (
              <>
                {<Header />}
                <PrivateRoute
                  exact
                  path="/password/update"
                  component={UpdatePassword}
                />
                {<Footer />}
              </>
            )}
          />

          <Route
            exact
            path="/orders"
            render={() => (
              <>
                {<Header />}
                <PrivateRoute exact path="/orders" component={MyOrder} />
                {<Footer />}
              </>
            )}
          />

          <Route
            exact
            path="/checkout"
            render={() => (
              <>
                {<Header />}
                <PrivateRoute exact path="/checkout" component={Checkout} />
                {<Footer />}
              </>
            )}
          />

          <Route
            exact
            path="/shipping"
            render={() => (
              <>
                {<Header />}
                <PrivateRoute exact path="/shipping" component={Shipping} />
                {<Footer />}
              </>
            )}
          />

          <Route
            exact
            path="/order/confirm"
            render={() => (
              <>
                {<Header />}
                <PrivateRoute
                  exact
                  path="/order/confirm"
                  component={ConfirmOrder}
                />
                {<Footer />}
              </>
            )}
          />

          <Route
            exact
            path="/success"
            render={() => (
              <>
                {<Header />}
                <PrivateRoute exact path="/success" component={OrderSuccess} />
                {<Footer />}
              </>
            )}
          />
        </Switch>

        {/* Admin routes */}
        <Suspense fallback={<CricketBallLoader />}>
          <Switch>
            <AdminRoute
              exact
              path="/admin-dashboard"
              component={LazyDashboard}
            />
            <AdminRoute
              exact
              path="/admin/products"
              component={LazyProductList}
            />
            <AdminRoute
              exact
              path="/admin/product/:id"
              component={LazyUpdateProduct}
            />
            <AdminRoute
              exact
              path="/admin/reviews"
              component={LazyProductReviews}
            />
            <AdminRoute
              exact
              path="/admin/analytics"
              component={LazySalesAnalysis}
            />
            <AdminRoute
              exact
              path="/admin/reports"
              component={LazyReports}
            />
            <AdminRoute
              exact
              path="/admin/settings"
              component={LazySettings}
            />
            <AdminRoute
              exact
              path="/admin/orders"
              component={LazyOrderList}
            />
            <AdminRoute
              exact
              path="/admin/order/:id"
              component={LazyProcessOrder}
            />
            <AdminRoute
              exact
              path="/admin/new/product"
              component={LazyNewProduct}
            />
            <AdminRoute
              exact
              path="/admin/users"
              component={LazyUserList}
            />
            <AdminRoute
              exact
              path="/admin/vendors"
              component={LazyVendorList}
            />
            <AdminRoute
              exact
              path="/admin/user/:id"
              component={LazyUpdateUser}
            />
          </Switch>
        </Suspense>

        {/* Vendor routes */}
        <Suspense fallback={<CricketBallLoader />}>
          <Switch>
            <VendorRoute
              exact
              path="/vendor/dashboard"
              component={VendorDashboard}
            />
            <VendorRoute
              exact
              path="/vendor/products"
              component={VendorProductList}
            />
            <VendorRoute
              exact
              path="/vendor/orders"
              component={VendorOrderList}
            />
            <VendorRoute
              exact
              path="/vendor/order/:id"
              component={LazyProcessOrder}
            />
            <VendorRoute
              exact
              path="/vendor/product/new"
              component={VendorNewProduct}
            />
            <VendorRoute
              exact
              path="/vendor/product/:id"
              component={VendorUpdateProduct}
            />
            <VendorRoute
              exact
              path="/vendor/analytics"
              component={SalesAnalytics}
            />
            <VendorRoute
              exact
              path="/vendor/settings"
              component={VendorSettings}
            />
          </Switch>
        </Suspense>

        {stripePromise && (
          <Elements stripe={stripePromise}>
            <PrivateRoute
              exact
              path="/process/payment"
              render={() => (
                <>
                  <Header />
                  <Payment />
                </>
              )}
            />
          </Elements>
        )}
      </Suspense>
    </>
  );
}

export default App;
