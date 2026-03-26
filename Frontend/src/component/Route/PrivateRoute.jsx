import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Redirect, Route } from "react-router-dom";
import { load_UserProfile } from "../../actions/userAction";
import CricketBallLoader from "../layouts/loader/Loader";

function PrivateRoute({ component: Component, render, ...rest }) {
  const { loading, isAuthenticated, user } = useSelector(
    (state) => state.userData
  );

  if (loading) {
    return <CricketBallLoader />;
  }

  if (isAuthenticated === false) {
    return <Redirect to="/login" />;
  }

  if (user.role === "admin") {
    return <Redirect to="/admin-dashboard" />;
  }

  if (user.role === "vendor") {
    if (user.isApproved === false) {
      return <Redirect to="/vendor/pending" />;
    }
    return <Redirect to="/vendor/dashboard" />;
  }

  return (
    <Route
      {...rest}
      render={(props) =>
        Component ? <Component {...props} /> : render(props)
      }
    />
  );
}

export function AdminRoute({ component: Component, render, ...rest }) {
  const { loading, isAuthenticated, user } = useSelector(
    (state) => state.userData
  );

  if (loading) {
    return <CricketBallLoader />;
  }

  if (isAuthenticated === false) {
    return <Redirect to="/login" />;
  }

  if (user.role !== "admin") {
    return <Redirect to="/" />;
  }

  return (
    <Route
      {...rest}
      render={(props) =>
        Component ? <Component {...props} /> : render(props)
      }
    />
  );
}

export function VendorRoute({ component: Component, render, ...rest }) {
  const { loading, isAuthenticated, user } = useSelector(
    (state) => state.userData
  );

  if (loading) {
    return <CricketBallLoader />;
  }

  if (isAuthenticated === false) {
    return <Redirect to="/login" />;
  }

  if (user.role !== "vendor") {
    return <Redirect to="/" />;
  }

  if (user.isApproved === false) {
    return <Redirect to="/vendor/pending" />;
  }

  return (
    <Route
      {...rest}
      render={(props) =>
        Component ? <Component {...props} /> : render(props)
      }
    />
  );
}

export function PublicRoute({ component: Component, render, ...rest }) {
  const { loading, isAuthenticated, user } = useSelector(
    (state) => state.userData
  );

  if (loading) {
    return <CricketBallLoader />;
  }

  if (isAuthenticated) {
    if (user?.role === "admin") {
      return <Redirect to="/admin-dashboard" />;
    }
    if (user?.role === "vendor" && user.isApproved === false) {
      return <Redirect to="/vendor/pending" />;
    }
    // Approved vendors can browse public pages (home, products, etc.)
  }

  return (
    <Route
      {...rest}
      render={(props) =>
        Component ? <Component {...props} /> : render(props)
      }
    />
  );
}

export default PrivateRoute;
