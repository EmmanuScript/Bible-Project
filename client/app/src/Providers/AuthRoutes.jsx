import ForgotPassword from "../pages/ForgotPassword";
import Login from "../pages/Login";
import OTPInput from "../pages/OTP";
import ResetPassword from "../pages/ResetPassword";
import { useAuth } from "./AuthProviders";

function AppRoutes() {
  const { isLogin, isForgotPassword, isOTPVerified, openResetPassword } =
    useAuth();

  // Render components conditionally based on authentication flow
  switch (true) {
    case isLogin:
      return <Login />;
    case isForgotPassword:
      return <ForgotPassword />;
    case isOTPVerified:
      return <OTPInput />;
    case openResetPassword:
      return <ResetPassword />;
    default:
      return <Login />;
  }
}

export default AppRoutes;
