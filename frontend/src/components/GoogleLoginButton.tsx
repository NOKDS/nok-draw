import GoogleButton from "react-google-button";
import { useTheme } from "../context/ThemeContext";
import { setLoginStatus } from "../redux/user/user.actions";
import { useDispatch } from "react-redux";

const GoogleLoginButton = () => {
  const { darkMode } = useTheme();
  const dispatch = useDispatch();

  const handleGoogleSignIn = () => {
    window.location.href = "http://localhost:8080/auth/google/";
    sessionStorage.setItem("isLoggedIn", "true");
  };

  return (
    <GoogleButton
      type={darkMode ? "light" : "dark"}
      className="google-login-btn"
      onClick={handleGoogleSignIn}
      style={{ width: "%100", borderRadius: 3 }}
    ></GoogleButton>
  );
};

export default GoogleLoginButton;
