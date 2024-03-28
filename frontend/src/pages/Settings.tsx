import React from "react";
import {
  TextField,
  Avatar,
  Button,
  Container,
  Grid,
  CssBaseline,
  Paper,
  Box,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/rootReducer";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { useNavigate } from "react-router-dom";
import { updateUserThunk } from "../redux/user/user.actions";
import StarsAnimation2 from "../components/StarsAnimation2";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

const Settings: React.FC = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch() as ThunkDispatch<RootState, null, AnyAction>;
  const navigate = useNavigate();
  const [passwordsMatch, setPasswordsMatch] = React.useState(true);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [userData, setUserData] = React.useState({
    email: user.email,
    name: user.name,
    username: user.username,
    password: "",
    confirmPassword: "",
  });

  const handleAvatarClick = () => {
    navigate("/settings/avatars");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      (userData.password && userData.confirmPassword) ||
      (!userData.password && !userData.confirmPassword)
    ) {
      const updatedUserData: any = {};

      if (userData.email !== user.email) {
        updatedUserData.email = userData.email;
      }
      if (userData.username !== user.username) {
        updatedUserData.username = userData.username;
      }
      if (userData.name !== user.name) {
        updatedUserData.name = userData.name;
      }

      if (userData.password && userData.password === userData.confirmPassword) {
        updatedUserData.password = userData.password;
        setPasswordsMatch(true);
      } else {
        setPasswordsMatch(false);
      }

      if (Object.keys(updatedUserData).length > 0) {
        dispatch(updateUserThunk(updatedUserData));
      }
    }
  };

  return (
    <Container
      component="main"
      maxWidth={isSmallScreen ? false : "lg"}
      sx={{
        padding: 2,
      }}
    >
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          mt: isSmallScreen ? "20%" : "10%",
        }}
      >
        <Paper
          elevation={8}
          sx={{
            padding: 5,
            textAlign: "center",
          }}
        >
          <Button
            onClick={handleAvatarClick}
            disableRipple
            sx={{
              "&:hover": {
                backgroundColor: "transparent",
              },
            }}
          >
            <Avatar
              alt={user.name}
              src={user.image}
              sx={{
                width: "100%",
                height: "auto",
                maxWidth: 200,
                maxHeight: 200,
                border: "4px solid #fff",

                mb: 2,
                "&:hover": {
                  border: "2px solid #007BFF",
                  transform: "scale(1.05)",
                  boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
                  "&::after": {
                    fontFamily: "'Nova Square', sans-serif",
                    content: "'Change Avatar'",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                    color: "white",
                  },
                },
              }}
            />
          </Button>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={userData.email}
                  onChange={handleChange}
                  variant="outlined"
                  required
                />
              </Grid>
              {isSmallScreen ? (
                <>
                  <Grid item xs={6} sm={6}>
                    <TextField
                      fullWidth
                      label="Username"
                      name="username"
                      value={userData.username}
                      onChange={handleChange}
                      variant="outlined"
                      required
                    />
                  </Grid>
                  <Grid item xs={6} sm={6}>
                    <TextField
                      fullWidth
                      label="Name"
                      name="name"
                      value={userData.name}
                      onChange={handleChange}
                      variant="outlined"
                      required
                    />
                  </Grid>
                </>
              ) : (
                <>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Username"
                      name="username"
                      value={userData.username}
                      onChange={handleChange}
                      variant="outlined"
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Name"
                      name="name"
                      value={userData.name}
                      onChange={handleChange}
                      variant="outlined"
                      required
                    />
                  </Grid>
                </>
              )}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="password"
                  label="New Password"
                  name="password"
                  value={userData.password}
                  onChange={handleChange}
                  variant="outlined"
                  error={userData.password !== userData.confirmPassword}
                  helperText={
                    userData.password !== userData.confirmPassword &&
                    !!userData.confirmPassword
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="password"
                  label="Confirm New Password"
                  name="confirmPassword"
                  value={userData.confirmPassword}
                  onChange={handleChange}
                  variant="outlined"
                  error={userData.password !== userData.confirmPassword}
                  helperText={
                    userData.password !== userData.confirmPassword &&
                    !!userData.confirmPassword &&
                    "Passwords do not match"
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{ fontFamily: "'Nova Square', sans-serif" }}
                >
                  Save Changes
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
        <StarsAnimation2 />
      </Box>
    </Container>
  );
};

export default Settings;
