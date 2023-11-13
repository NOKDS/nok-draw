import { Routes, Route } from "react-router-dom";
import SignIn from "../pages/SignIn";
import Home from "../pages/Home";
import SignUp from "../pages/SignUp";
import ProtectedRoute from "../components/ProtectedRoute";
import GameRoom from "../components/GameRoom";
import Dashboard from "../pages/Dashboard";
import { RootState } from "../redux/rootReducer";
import { useSelector } from "react-redux";
import AvatartPicker from "../components/AvatarPicker";
const AppRoutes = () => {
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/gameroom" element={<GameRoom />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute isLoggedIn={isLoggedIn}>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/avatar"
        element={
          <ProtectedRoute isLoggedIn={isLoggedIn}>
            <AvatartPicker />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
