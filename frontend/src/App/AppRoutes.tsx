import React from "react";
import { Routes, Route } from "react-router-dom";
import SignIn from "../pages/SignIn";
import Home from "../pages/Home";
import SignUp from "../pages/SignUp";
import Test from "../pages/Test";
import ProtectedRoute from "../components/ProtectedRoute";
import UserProfile from "../pages/Test";
import GameRoom from "../components/GameRoom";
const AppRoutes = () => {
  const isLoggedIn = !!sessionStorage.getItem("isLoggedIn");
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/test" element={<Test />} />
      <Route path="/gameroom" element={<GameRoom/>} />
      <Route
        path="/profile"
        element={
          <ProtectedRoute isLoggedIn={isLoggedIn}>
            <UserProfile />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
