import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { useTheme } from "../context/ThemeContext";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

export default function ButtonAppBar() {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <a href="/" style={{ textDecoration: "none", color: "inherit" }}>
              NOKDraw
            </a>
          </Typography>
          <Button color="inherit" href="/login">
            Login
          </Button>
          <Button className="theme" onClick={toggleDarkMode}>
            <span>
              {darkMode === false && (
                <img
                  src="https://cdn-icons-png.flaticon.com/128/702/702471.png"
                  alt="Light Mode"
                  width="25rem"
                />
              )}
              {darkMode === true && (
                <img
                  src="https://cdn-icons-png.flaticon.com/128/10484/10484062.png"
                  alt="Dark Mode"
                  width="25rem"
                />
              )}
            </span>
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
