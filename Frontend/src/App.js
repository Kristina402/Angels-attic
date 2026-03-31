import React, { useEffect, Suspense } from "react";
import { Route, Switch } from "react-router-dom";
import { useDispatch } from "react-redux";
import { load_UserProfile } from "./actions/userAction";
import CricketBallLoader from "./component/layouts/loader/Loader";
import PrivateRoute, { AdminRoute, VendorRoute, PublicRoute } from "./component/Route/PrivateRoute";
import { SpeedInsights } from '@vercel/speed-insights/react';
import "./App.css";

import Header from "./component/layouts/Header1.jsx/Header";

import Home from "./component/Home/Home";
import Footer from "./component/layouts/Footer/Footer";
import ProductDetails from "./component/Product/ProductDetails";
import Products from "./component/Product/Products";
import Signup from "./component/User/SignUp";
import Login from "./component/User/Login";
import Profile from "./component/User/Profile";
import UpdateProfile from "./component/User/UpdateProfile";
import UpdatePassword from "./component/User/UpdatePassword";
import ForgotPassword from "./component/User/ForgetPassword";
import VerifyOTP from "./component/User/VerifyOTP";
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

const MainLayout = ({ children }) => (
  <>
    <Header />
    <main className="main-content">{children}</main>
    <Footer />
  </>
);

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(load_UserProfile());

    // eslint-disable-next-line
  }, []);

  return (
    <div className="app-container">
      <SpeedInsights />
      <Suspense fallback={<CricketBallLoader />}>
        <Switch>
          <PublicRoute
            exact
            path="/"
            render={() => (
              <MainLayout>
                <Home />
              </MainLayout>
            )}
          />

          <PublicRoute
            exact
            path="/product/:id"
            render={() => (
              <MainLayout>
                <ProductDetails />
              </MainLayout>
            )}
          />

          <PublicRoute
            exact
            path="/products"
            render={() => (
              <MainLayout>
                <Products />
              </MainLayout>
            )}
          />

          <PublicRoute
            path="/products/:keyword"
            render={() => (
              <MainLayout>
                <Products />
              </MainLayout>
            )}
          />

          <PublicRoute
            exact
            path="/signup"
            render={() => (
              <MainLayout>
                <Signup />
              </MainLayout>
            )}
          />

          <PublicRoute
            exact
            path="/vendor/register"
            render={() => (
              <MainLayout>
                <VendorRegistration />
              </MainLayout>
            )}
          />

          <PublicRoute
            exact
            path="/login"
            render={() => (
              <MainLayout>
                <Login />
              </MainLayout>
            )}
          />

          <PublicRoute
            exact
            path="/password/forgot"
            render={() => (
              <MainLayout>
                <ForgotPassword />
              </MainLayout>
            )}
          />

          <PublicRoute
            exact
            path="/password/verify-otp"
            render={() => (
              <MainLayout>
                <VerifyOTP />
              </MainLayout>
            )}
          />

          <PublicRoute
            exact
            path="/password/reset"
            render={() => (
              <MainLayout>
                <ResetPassword />
              </MainLayout>
            )}
          />

          <PrivateRoute
            exact
            path="/cart"
            render={() => (
              <MainLayout>
                <Cart />
              </MainLayout>
            )}
          />

          <PrivateRoute
            exact
            path="/wishlist"
            render={() => (
              <MainLayout>
                <Wishlist />
              </MainLayout>
            )}
          />

          <PublicRoute
            exact
            path="/policy/return"
            render={() => (
              <MainLayout>
                <ReturnPolicyPage />
              </MainLayout>
            )}
          />

          <PublicRoute
            exact
            path="/policy/Terms"
            render={() => (
              <MainLayout>
                <TermsUse />
              </MainLayout>
            )}
          />

          <PublicRoute
            exact
            path="/policy/privacy"
            render={() => (
              <MainLayout>
                <PrivacyPolicy />
              </MainLayout>
            )}
          />

          <PublicRoute
            exact
            path="/terms/conditions"
            render={() => (
              <MainLayout>
                <TermsAndConditions />
              </MainLayout>
            )}
          />

          <PublicRoute
            exact
            path="/contact"
            render={() => (
              <MainLayout>
                <ContactForm />
              </MainLayout>
            )}
          />

          <PublicRoute
            exact
            path="/about"
            render={() => (
              <MainLayout>
                <About />
              </MainLayout>
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
              <MainLayout>
                <PrivateRoute exact path="/account" component={Profile} />
              </MainLayout>
            )}
          />

          <Route
            exact
            path="/profile/update"
            render={() => (
              <MainLayout>
                <PrivateRoute
                  exact
                  path="/profile/update"
                  component={UpdateProfile}
                />
              </MainLayout>
            )}
          />

          <Route
            exact
            path="/password/update"
            render={() => (
              <MainLayout>
                <PrivateRoute
                  exact
                  path="/password/update"
                  component={UpdatePassword}
                />
              </MainLayout>
            )}
          />

          <Route
            exact
            path="/orders"
            render={() => (
              <MainLayout>
                <PrivateRoute exact path="/orders" component={MyOrder} />
              </MainLayout>
            )}
          />

          <Route
            exact
            path="/checkout"
            render={() => (
              <MainLayout>
                <PrivateRoute exact path="/checkout" component={Checkout} />
              </MainLayout>
            )}
          />

          <Route
            exact
            path="/shipping"
            render={() => (
              <MainLayout>
                <PrivateRoute exact path="/shipping" component={Shipping} />
              </MainLayout>
            )}
          />

          <Route
            exact
            path="/order/confirm"
            render={() => (
              <MainLayout>
                <PrivateRoute
                  exact
                  path="/order/confirm"
                  component={ConfirmOrder}
                />
              </MainLayout>
            )}
          />

          <Route
            exact
            path="/success"
            render={() => (
              <MainLayout>
                <PrivateRoute exact path="/success" component={OrderSuccess} />
              </MainLayout>
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
              path="/vendor/reviews"
              component={LazyProductReviews}
            />
            <VendorRoute
              exact
              path="/vendor/settings"
              component={VendorSettings}
            />
          </Switch>
        </Suspense>
      </Suspense>
    </div>
  );
}

export default App;
