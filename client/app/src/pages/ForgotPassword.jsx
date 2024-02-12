// ForgotPassword.js
import React, { useState } from "react";
import axios from "axios";
import { ReactComponent as ArrowRightIcon } from "../assets/svg/keyboardArrowRightIcon.svg";
import { useAuth } from "../Providers/AuthProviders";
import { toast } from "react-toastify";
import { DATA_URL } from "../config";
import Loader from "../assets/3-dot.gif";

const ForgotPassword = () => {
  const { setIsForgotPassword, setIsOTPVerified } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const generateOTP = () => {
    // Generate a random number between 100000 and 999999
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp.toString(); // Convert to string
  };

  const handleForgotPassword = async (e) => {
    try {
      setLoading(true);
      e.preventDefault();

      if (!email) {
        setLoading(false);
        return toast.error("Please provide a valid email");
      }

      const otp = generateOTP();

      const response = await axios.post(`${DATA_URL}api/forgot-password`, {
        email: email,
        otp: otp,
      });

      if (response.status === 200) {
        setLoading(false);
        toast.success("Email sent successfully");
        localStorage.setItem("email", email);
        setIsForgotPassword(false);
        setIsOTPVerified(true);
      } else {
        setLoading(false);
        toast.error("Failed to send email. Please try again later.");
        // Handle error condition
      }
    } catch (error) {
      setLoading(false);
      toast.error(error.response.data.message);
      console.error("Error:", error.response.data.message);
    }
  };

  const onChange = (e) => {
    setEmail(e.target.value);
  };

  return (
    <>
      <div className="pageContainer">
        <h2>Forgot Password</h2>
        <form onSubmit={handleForgotPassword}>
          <input
            type="email"
            className="emailInput"
            placeholder="Email"
            id="email"
            value={email}
            onChange={onChange}
          />
          {loading && (
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <img src={Loader} width={50} height={50} alt="loading" />
            </div>
          )}
          <div className="signInBar">
            <p className="signInText">Send Reset Email</p>
            <button type="submit" className="signInButton">
              <ArrowRightIcon fill="green" width="34px" height="34px" />
            </button>
          </div>{" "}
        </form>
      </div>
    </>
  );
};

export default ForgotPassword;
