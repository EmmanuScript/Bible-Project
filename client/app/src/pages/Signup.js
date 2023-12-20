import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ReactComponent as ArrowRightIcon } from "../assets/svg/keyboardArrowRightIcon.svg";
import visibilityIcon from "../assets/svg/visibilityIcon.svg";


function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const { name, email, password } = formData;

  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();

    console.log("never time")
  };

  return (
    <>
      <div className='pageContainer'>
        <header>
          <p className='pageHeader'>Welcome Back!</p>
        </header>

        <form onSubmit={onSubmit}>
          <input
            type='text'
            className='nameInput'
            placeholder='name'
            id='name'
            value={name}
            onChange={onChange}
          />
          <input
            type='email'
            className='emailInput'
            placeholder='email'
            id='email'
            value={email}
            onChange={onChange}
          />

          <div className='passwordInputDiv'>
            <input
              type={showPassword ? "text" : "password"}
              className='passwordInput'
              id='password'
              value={password}
              onChange={onChange}
            />

            <img
              src={visibilityIcon}
              className='showPassword'
              alt='show password'
              onClick={() => setShowPassword((prevState) => !prevState)}
            />

            <Link to='/forgot-password' className='forgotPasswordLink'>
              Forgot Password?
            </Link>

            <div className='signUpBar'>
              <p className='signUpText'>Sign Up</p>
              <button className='signUpButton'>
                <ArrowRightIcon fill='#fff' width='34px' height='34px' />
              </button>
            </div>
          </div>
        </form>


        <Link to='/login' className='registerLink'>
          Sign In Instead
        </Link>

      </div>
    </>
  );
}

export default Signup;
