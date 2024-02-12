import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ReactComponent as ArrowRightIcon } from "../assets/svg/keyboardArrowRightIcon.svg";
import visibilityIcon from "../assets/svg/visibilityIcon.svg";
import { toast } from "react-toastify";
import { useAuth } from "../Providers/AuthProviders";
import Loader from "../assets/3-dot.gif";

function Signup() {
  const { signup, error } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    group: "",
  });
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const { name, email, password, group } = formData;

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    setLoading(true);

    e.preventDefault();
    if (!email || !password) {
      setLoading(false);

      return toast.error("All Fields must be filled");
    }

    if (password.length < 6) {
      setLoading(false);
      return toast.error("Password length must be more 6");
    }

    const formData = {
      name: name,
      group: group,
      email: email,
      password: password,
    };

    const signupSuccessful = await signup(formData);

    if (signupSuccessful) {
      setLoading(false);
      navigate("/home");
      toast.success("Signup successful!");
    } else {
      setLoading(false);
      toast.error(error);
    }
  };

  return (
    <>
      <div className="pageContainer">
        <header>
          <p className="pageHeader">Welcome Back!</p>
        </header>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="nameInput"
            placeholder="name"
            id="name"
            value={name}
            onChange={onChange}
          />
          <input
            type="email"
            className="emailInput"
            placeholder="email"
            id="email"
            value={email}
            onChange={onChange}
          />

          <input
            type="text"
            className="emailInput"
            placeholder="group"
            id="group"
            value={group}
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

            <div className="signUpBar">
              <p className="signUpText">Sign Up</p>
              <button className="signUpButton">
                <ArrowRightIcon fill="#fff" width="34px" height="34px" />
              </button>
            </div>
          </div>
        </form>

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

        <Link to="/login" className="registerLink">
          Sign In Instead
        </Link>
      </div>
    </>
  );
}

export default Signup;
