import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ReactComponent as ArrowRightIcon } from "../assets/svg/keyboardArrowRightIcon.svg";
import visibilityIcon from "../assets/svg/visibilityIcon.svg";
import { useAuth } from "../Providers/AuthProviders";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login() {
  const { setIsForgotPassword, setIsLogin } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const { login, error, setError } = useAuth();
  const navigate = useNavigate();

  const onChange = (e) => {
    setError(null);
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const { email, password } = formData;

  const handleLogin = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      if (!email || !password) {
        setLoading(false);
        return toast.error("All Fields must be filled");
      }

      const loginSuccessful = await login(formData.email, formData.password);

      if (loginSuccessful) {
        navigate("/home");
        setLoading(false);
        toast.success("Login successful!", {
          autoClose: 1000,
        });
      } else {
        setLoading(false);
        toast.error(error);
      }
    } catch (e) {
      console.error("Error:", e);
    }
  };

  return (
    <>
      <div className="pageContainer">
        <header>
          <p className="pageHeader">Welcome Back!</p>
        </header>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            className="emailInput"
            placeholder="Email"
            id="email"
            value={email}
            onChange={onChange}
          />

          <div className="passwordInputDiv">
            <input
              type={showPassword ? "text" : "password"}
              className="passwordInput"
              placeholder="Password"
              id="password"
              value={password}
              onChange={onChange}
            />

            <img
              src={visibilityIcon}
              className="showPassword"
              alt="Show password"
              onClick={() => setShowPassword((prevState) => !prevState)}
            />

            <div className="signInBar">
              <p className="signInText">{loading ? "loading..." : "Sign In"}</p>
              <button disabled={loading} className="signInButton">
                <ArrowRightIcon fill="#fff" width="34px" height="34px" />
              </button>
            </div>
          </div>
        </form>
        <button
          onClick={() => {
            setIsLogin(false);
            setIsForgotPassword(true);
          }}
          className="forgotPasswordLink"
        >
          Forgot Password?
        </button>

        <Link to="/sign-up" className="registerLink">
          Sign Up Instead
        </Link>
      </div>

      <ToastContainer />
    </>
  );
}

export default Login;
