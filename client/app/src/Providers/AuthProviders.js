import React, { createContext, useContext, useState } from "react";
import { DATA_URL } from "../config";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("jwt") === "true"
  );
  const [user, setUser] = useState({});
  const [error, setError] = useState();
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(false);

  const [isOTPVerified, setIsOTPVerified] = useState(false);
  const [openResetPassword, setOpenResetPassword] = useState(false);

  const isTokenExpired = () => {
    const token = localStorage.getItem("jwt");
    const expirationTime = localStorage.getItem("expiryTime");
    if (token && expirationTime) {
      const currentTime = Math.floor(Date.now() / 1000); // Convert current time to seconds
      return currentTime > parseInt(expirationTime, 10);
    }
    return true; // Treat as expired if token or expiration time is missing
  };

  const login = async (username, password) => {
    try {
      const response = await fetch(`${DATA_URL}api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data);
        Cookies.set("jwt", data.token, { expires: 7 });
        // Store the JWT token in localStorage
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("group", data.group);
        localStorage.setItem("jwt", data.token);
        localStorage.setItem("jwtExpiration", data.maxAge);

        const currentTime = new Date().getTime();
        const newTime = currentTime + data.maxAge * 1000;

        localStorage.setItem("expiryTime", newTime);
        console.log(newTime);

        setIsLogin(true);
        setIsLoggedIn(true);
        return true;
      } else {
        const data = await response.json();
        const errorObj = data.errors;
        console.log(errorObj);
        for (const key in errorObj) {
          if (errorObj[key] !== "" && typeof errorObj[key] === "string") {
            setError(errorObj[key]);
            toast(errorObj[key]);
          }
        }
        console.error("Login failed:", data.errors);
        return false;
      }
    } catch (error) {
      setError(error.message);
      console.error("An error occurred during login:", error.message);
      return false;
    }
  };

  const signup = async (formData) => {
    try {
      const response = await fetch(`${DATA_URL}api/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data);
        Cookies.set("jwt", data.token, { expires: 7 });
        // Store the JWT token in localStorage
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("group", data.group);
        localStorage.setItem("jwt", data.token);

        return true;
      } else {
        const data = await response.json();
        const errorObj = data.errors;
        for (const key in errorObj) {
          if (errorObj.hasOwnProperty(key) && errorObj[key]) {
            setError(errorObj[key]);
          }
          console.error("Sign up failed:", data.errors);
          return false;
        }
      }
    } catch (error) {
      setError(error.message);
      console.error("An error occurred during login:", error.message);
      return false;
    }
  };

  const logout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
  };

  const isAuthenticated = () => {
    const token = localStorage.getItem("jwt");
    const expiryTime = localStorage.getItem("expiryTime");

    if (token && expiryTime) {
      const currentTime = new Date().getTime();
      const expirationTime = parseInt(expiryTime, 10);
      console.log(currentTime, expirationTime);
      return currentTime < expirationTime;
    }

    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        login,
        logout,
        user,
        isAuthenticated,
        error,
        setError,
        signup,
        isForgotPassword,
        isOTPVerified,
        openResetPassword,
        setIsForgotPassword,
        setOpenResetPassword,
        setIsLoggedIn,
        setIsOTPVerified,
        isLogin,
        setIsLogin,
        isTokenExpired,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
