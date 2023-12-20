import { useContext, useState } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { ReactComponent as ArrowRightIcon } from "../assets/svg/keyboardArrowRightIcon.svg";
import visibilityIcon from "../assets/svg/visibilityIcon.svg";
import { AuthContext } from "../Providers/AuthProviders";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const { email, password } = formData;

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log(formData);
    login(formData.email, formData.password);
    navigate("/");
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
            placeholder="email"
            id="email"
            value={email}
            onChange={onChange}
          />

          <div className="passwordInputDiv">
            <input
              type={showPassword ? "text" : "password"}
              className="passwordInput"
              id="password"
              value={password}
              onChange={onChange}
            />

            <img
              src={visibilityIcon}
              className="showPassword"
              alt="show password"
              onClick={() => setShowPassword((prevState) => !prevState)}
            />

            <Link to="/forgot-password" className="forgotPasswordLink">
              Forgot Password?
            </Link>

            <div className="signInBar">
              <p className="signInText">Sign In</p>
              <button className="signInButton">
                <ArrowRightIcon fill="#fff" width="34px" height="34px" />
              </button>
            </div>
          </div>
        </form>

        <Link
          to="/sign-up"
          style={{ marginBottom: "100px" }}
          className="registerLink"
        >
          Sign Up Instead
        </Link>
      </div>
    </>
  );
}

export default Login;
