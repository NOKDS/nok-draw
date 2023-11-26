import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import GoogleButton from "react-google-button";
import { useTheme } from "../context/ThemeContext";
import { fetchUserThunk, setLoginStatus } from "../redux/user/user.actions";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { RootState } from "../redux/rootReducer";
import { useNavigate } from "react-router-dom";

const GoogleLoginButton: React.FC = () => {
  const dispatch = useDispatch() as ThunkDispatch<RootState, null, AnyAction>;
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const handleGoogleSignIn = () => {
    //window.location.href = "https://nok-draw-backend.vercel.app/auth/google";
    //window.location.href = "http://localhost:8080/auth/google";
    window.open("https://nok-draw-backend.vercel.app/auth/google", "_self");
  };

  useEffect(() => {
    const handleGoogleSignInCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("googleSignInSuccess")) {
        try {
          await dispatch(setLoginStatus(true));
          const response = await fetch("http://localhost:8080/auth/me", {
            method: "GET",
            credentials: "include",
          });

          if (response.ok) {
            const userData = await response.json();
            console.log("User information:", userData);
            navigate("/dashboard");
          } else {
            console.log("Failed to check authentication status");
          }
        } catch (error) {
          console.error("Error fetching /auth/me:", error);
        }
      }
    };

    handleGoogleSignInCallback();
  }, [dispatch, navigate]);

  return (
    <GoogleButton
      type={darkMode ? "light" : "dark"}
      className="google-login-btn"
      onClick={handleGoogleSignIn}
      style={{ width: "100%", borderRadius: 3, height: "auto" }}
    >
      Sign in with Google
    </GoogleButton>
  );
};

export default GoogleLoginButton;
