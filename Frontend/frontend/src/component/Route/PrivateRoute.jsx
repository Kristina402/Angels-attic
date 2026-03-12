import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Redirect, Route } from "react-router-dom";
import { load_UserProfile } from "../../actions/userAction";
import CricketBallLoader from "../layouts/loader/Loader";
function PrivateRoute({ isAdmin, isVendor, component: Component, render, ...rest }) {
  const { loading, isAuthenticated, user } = useSelector(
    (state) => state.userData
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(load_UserProfile());
  }, [dispatch]);


  if (loading) {
    return <CricketBallLoader />; 
  }

  // If the user data failed to load or the user is not authenticated, redirect to the login page
  if (isAuthenticated === false) {
    return <Redirect to="/login" />;
  }

  // Admin access control
  if (isAdmin && user.role !== "admin") {
    return <Redirect to="/login" />;
  }

  // Vendor access control
  if (isVendor) {
    if (user.role !== "vendor") {
      return <Redirect to="/login" />;
    }
    // Check if vendor is approved
    if (user.isApproved === false) {
      return <Redirect to="/vendor/pending" />;
    }
  }

  // If the route is NOT an admin route, but the user IS an admin, redirect them to admin dashboard
  if (!isAdmin && !isVendor && user.role === "admin") {
    return <Redirect to="/admin-dashboard" />;
  }

  // If the route is NOT a vendor route, but the user IS a vendor, redirect them to vendor dashboard
  if (!isAdmin && !isVendor && user.role === "vendor") {
    // If vendor is not approved, redirect to pending page
    if (user.isApproved === false) {
      return <Redirect to="/vendor/pending" />;
    }
    return <Redirect to="/vendor/dashboard" />;
  }

  // If the user is authenticated and role checks pass, render the specified component
  return (
    <Route
      {...rest}
      render={(props) =>
        Component ? <Component {...props} /> : render(props)
      }
    />
  );
}

// Route for pages that should only be accessible to non-admins and non-vendors (e.g., Home, Products, Login, Signup)
export function PublicRoute({ component: Component, render, ...rest }) {
  const { loading, isAuthenticated, user } = useSelector(
    (state) => state.userData
  );

  if (loading) {
    return <CricketBallLoader />;
  }

  // Redirect admin and vendor away from public pages
  if (isAuthenticated) {
    if (user?.role === "admin") {
      return <Redirect to="/admin-dashboard" />;
    }
    if (user?.role === "vendor") {
      if (user.isApproved === false) {
        return <Redirect to="/vendor/pending" />;
      }
      return <Redirect to="/vendor/dashboard" />;
    }
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
