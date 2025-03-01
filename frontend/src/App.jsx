import React, { useContext, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import { UserContext } from "./context/UserContext";
import { isTokenExpired } from "./utils/helpers";

// components
import Loader from "./components/Loader";

// pages
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import Home from "./pages/Home";
import Index from "./pages/Admin/Index";
import Profile from "./pages/Profile/Profile";
import Sites from "./pages/Admin/Sites";
import Typeparcs from "./pages/Admin/Typeparcs";
import Parcs from "./pages/Admin/Parcs";
import Engins from "./pages/Admin/Engins";

const App = () => {
  const [loading, setLoading] = useState(false);

  return (
    <div>
      <Router>
        {/* <LoadingWrapper setLoading={setLoading}> */}
        {loading && <Loader />}
        <AuthChecker />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/profile" element={<Profile />} />

          {/* ADMIN ROUTES */}
          <Route path="/admin" element={<Index />} />
          <Route path="/admin/sites" element={<Sites />} />
          <Route path="/admin/typeparcs" element={<Typeparcs />} />
          <Route path="/admin/parcs" element={<Parcs />} />
          <Route path="/admin/engins" element={<Engins />} />
        </Routes>
        {/* </LoadingWrapper> */}
      </Router>
    </div>
  );
};

export default App;

const AuthChecker = () => {
  const { updateUser } = useContext(UserContext);
  const location = useLocation();
  useEffect(() => {
    // check if user is in localStorage
    const localStorageUser = JSON.parse(localStorage.getItem("user"));
    if (localStorageUser) updateUser(localStorageUser);

    // check if token is in localStorage
    const localStorageToken = localStorage.getItem("token");

    // check if token is expired
    const tokenExpired =
      isTokenExpired(localStorageToken) &&
      location.pathname !== "/login" &&
      location.pathname !== "/signup";

    if (tokenExpired) {
      window.location.href = "/login"; // Force un redirect
      // token is expired ==> remove user and token from localStorage
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  }, [location]);

  return null;
};

const LoadingWrapper = ({ children, setLoading }) => {
  const location = useLocation();

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 0); // Simulate loading delay

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return children;
};
