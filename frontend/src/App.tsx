import React, { useEffect } from "react";
import ButtonAppBar from "./components/ButtonAppBar";
import AppRoutes from "./AppRoutes";
import { ThemeProviderWrapper } from "./context/ThemeContext";

function App() {
  return (
    <ThemeProviderWrapper>
      <div className="">
        <ButtonAppBar />
        <AppRoutes />
      </div>
    </ThemeProviderWrapper>
  );
}

export default App;
