import axios from "axios";
import React, { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import { DATA_URL } from "../config";
import { useAuth } from "../Providers/AuthProviders";
import Loader from "../assets/3-dot.gif";

const OTPInput = ({ length = 6 }) => {
  const [otp, setOtp] = useState(new Array(length).fill(""));
  const inputRefs = useRef([]);
  const [timer, setTimer] = useState(60);
  const [disable, setDisable] = useState(true);
  const [loading, setLoading] = useState(false);

  const { setIsOTPVerified, setOpenResetPassword } = useAuth();

  const generateOTP = () => {
    // Generate a random number between 100000 and 999999
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp.toString(); // Convert to string
  };

  const resendOTP = async () => {
    if (disable) return;
    try {
      setLoading(true);

      const email = localStorage.getItem("email");
      const otp = generateOTP();

      const response = await axios.post(`${DATA_URL}api/forgot-password`, {
        email: email,
        otp: otp,
      });

      if (response.status === 200) {
        setLoading(false);
        setDisable(true);
        setTimer(60);
        toast.success("Email resent successfully");
      } else {
        setLoading(false);
        toast.error("Failed to send email. Please try again later.");
        // Handle error condition
      }
    } catch (error) {
      setLoading(false);
      toast.error(error.response.data.message);
    }
  };

  const onComplete = async (data) => {
    try {
      setLoading(true);
      if (data.length === 0) {
        return toast.error("Fill in the Correct OTP");
      }

      const email = localStorage.getItem("email");
      const response = await axios.patch(`${DATA_URL}api/check-otp`, {
        email,
        otp: data,
      });

      if (response.status === 200) {
        setLoading(false);
        setIsOTPVerified(false);
        setOpenResetPassword(true);
      } else {
        setLoading(false);
        toast.error("Wrong OTP, Please Resend");
      }
    } catch (e) {
      setLoading(false);
      toast.error(e.response.data.message);
      console.error(e);
    }
  };

  const handleChange = (index, value) => {
    if (!isNaN(value) && value !== "") {
      setOtp((prevOtp) => {
        const newOtp = [...prevOtp];
        newOtp[index] = value;
        return newOtp;
      });

      // Focus on the next input if available
      if (index < length - 1 && value !== "") {
        inputRefs.current[index + 1].focus();
      }
    } else if (value === "") {
      // Clear the input if the value is empty (backspace/delete)
      setOtp((prevOtp) => {
        const newOtp = [...prevOtp];
        newOtp[index] = "";
        return newOtp;
      });

      // Focus on the previous input if available
      if (index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace" && index > 0 && !otp[index]) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();
    const pasteData = event.clipboardData.getData("text/plain").trim();
    if (/^\d+$/.test(pasteData) && pasteData.length === length) {
      setOtp(pasteData.split(""));
      onComplete(pasteData);
    }
  };

  useEffect(() => {
    let interval = setInterval(() => {
      setTimer((lastTimerCount) => {
        lastTimerCount <= 1 && clearInterval(interval);
        if (lastTimerCount <= 1) setDisable(false);
        if (lastTimerCount <= 0) return lastTimerCount;
        return lastTimerCount - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [disable]);

  return (
    <div className="otp-input-container">
      <div className="otp-header">
        <h3>
          You should have the OTP in your email, if you cannot find it in inbox,
          kindly check your "spam" folder
        </h3>
      </div>
      <div>
        <h2>Enter OTP Here</h2>
      </div>
      <div className="otp-input-wrapper">
        {otp.map((digit, index) => (
          <input
            key={index}
            type="text"
            className="otp-input"
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            maxLength="1"
            ref={(ref) => (inputRefs.current[index] = ref)}
          />
        ))}
      </div>
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
      <div>
        <button
          className="submit-button"
          onClick={() => onComplete(otp.join(""))}
        >
          Submit OTP
        </button>
      </div>
      <div>
        <p>Didn't Receive OTP? </p>
        <button
          style={{
            color: disable ? "grey" : "blue",
            cursor: disable ? "none" : "pointer",
            textDecorationLine: disable ? "none" : "underline",
          }}
          onClick={() => resendOTP()}
        >
          {disable ? `Resend OTP in ${timer}s` : "Resend OTP"}
        </button>
      </div>
    </div>
  );
};

export default OTPInput;
