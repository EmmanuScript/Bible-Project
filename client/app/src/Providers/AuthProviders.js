// AuthContext.js
import React, { createContext, useState } from "react";
import { useLocalStorage } from "../hooks/LocalStorage";

const AuthContext = createContext({
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  user: null,
  setUser: () => {},
});

const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [usage, setUsage] = useLocalStorage("user", "imbarinbe");

  const login = (email, password) => {
    if (email !== "oanjoyin@gmail.com") {
      setIsLoggedIn(false);
      setUser(user);
      console.log(user);
      return;
    }
    setIsLoggedIn(true);
    setUsage("ibeji");
    console.log(user);
    // setUser(user);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, setIsLoggedIn, user, setUser, login, logout, usage }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
