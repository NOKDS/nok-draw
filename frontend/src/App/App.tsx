import ButtonAppBar from "../components/ButtonAppBar";
import AppRoutes from "./AppRoutes";
import { ThemeProviderWrapper } from "../context/ThemeContext";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUserThunk, setLoginStatus } from "../redux/user/user.actions";
import { ThunkDispatch } from "redux-thunk";
import { RootState } from "../redux/rootReducer";
import { AnyAction } from "redux";
import { useSelector } from "react-redux";
import "./App.css";

function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch() as ThunkDispatch<RootState, null, AnyAction>;
  const isLoggedn = useSelector((state: RootState) => state.user.isLoggedIn);

  const handleLogout = () => {
    dispatch(logoutUserThunk());
    navigate("/");
  };

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem("isLoggedIn");
    if (isLoggedIn === "true") {
      dispatch(setLoginStatus(true));
    } else {
      dispatch(setLoginStatus(false));
    }
  }, [dispatch, isLoggedn]);

  return (
    <ThemeProviderWrapper>
      <div className="">
        <ButtonAppBar handleLogout={handleLogout} />
        <AppRoutes />
      </div>
    </ThemeProviderWrapper>
  );
}

export default App;
