import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ReactComponent as ArrowRightIcon } from "../assets/svg/keyboardArrowRightIcon.svg";
import visibilityIcon from "../assets/svg/visibilityIcon.svg";
import { toast } from "react-toastify";
import { useAuth } from "../Providers/AuthProviders";
import axios from "axios";
import { DATA_URL } from "../config";
import { Button, Modal } from "react-bootstrap";
import Loader from "../assets/3-dot.gif";

function ResetPassword() {
  const { setOpenResetPassword, setIsLogin } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    group: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const { password, confirmPassword } = formData;

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    try {
      setLoading(true);
      e.preventDefault();
      if (password !== confirmPassword) {
        setLoading(false);

        return toast.error("Password and Confirm Password must match");
      }

      if (password.length < 6) {
        setLoading(false);
        return toast.error("Password Length must be greater than 6");
      }

      const email = localStorage.getItem("email");

      const response = await axios.patch(`${DATA_URL}api/reset-password`, {
        email,
        password,
      });

      if (response.status === 200) {
        setLoading(false);
        setShowModal(true);
        toast.success("Password Reset Successful");
      } else {
        setLoading(false);
        toast.error("Reset Uncessful, Please try again later");
      }
    } catch (e) {
      setLoading(false);
      toast.error(e.response.data.error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setOpenResetPassword(false);
    setIsLogin(true);
    navigate("/login");
  };

  return (
    <>
      <div className="pageContainer">
        <header>
          <p className="pageHeader">Reset Password</p>
        </header>

        <form onSubmit={handleSubmit}>
          <div className="passwordInputDiv">
            <input
              type={showPassword ? "text" : "password"}
              className="passwordInput"
              placeholder="password"
              id="password"
              value={password}
              onChange={onChange}
            />

            <input
              type={showConfirmPassword ? "text" : "password"}
              className="passwordInput"
              id="confirmPassword"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={onChange}
            />

            <img
              src={visibilityIcon}
              className="showPassword"
              alt="show password"
              onClick={() => setShowPassword((prevState) => !prevState)}
            />

            <img
              src={visibilityIcon}
              className="showConfirmPassword"
              alt="show password"
              onClick={() => setShowConfirmPassword((prevState) => !prevState)}
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

            <div className="signUpBar">
              <p className="signUpText">Reset Password</p>
              <button className="signUpButton">
                <ArrowRightIcon fill="#fff" width="34px" height="34px" />
              </button>
            </div>
          </div>
        </form>
      </div>
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        className="modal-helper"
        style={{
          padding: "20px",
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Password Update Successful</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Your Password Has been reset, click the button below
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleLogin} className="registerLink">
            Go To Login Page
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ResetPassword;
