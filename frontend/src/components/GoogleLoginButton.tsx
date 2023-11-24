import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import GoogleButton from "react-google-button";
import { useTheme } from "../context/ThemeContext";
import { fetchUserThunk, setLoginStatus } from "../redux/user/user.actions";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { RootState } from "../redux/rootReducer";
import { useNavigate } from "react-router-dom";
import { fetchGamesThunk } from "../redux/games/games.actions";

const GoogleLoginButton: React.FC = () => {
  const dispatch = useDispatch() as ThunkDispatch<RootState, null, AnyAction>;
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const handleGoogleSignIn = () => {
    window.location.href = "https://nok-draw-backend.vercel.app/auth/google/";
  };

  useEffect(() => {
    const handleGoogleSignInCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("googleSignInSuccess")) {
        await dispatch(setLoginStatus(true));
        // await dispatch(fetchUserThunk());
        // await dispatch(fetchGamesThunk());
        navigate("/dashboard");
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
