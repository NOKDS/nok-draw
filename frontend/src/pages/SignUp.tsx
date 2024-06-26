import * as React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Footer from "../components/Footer";
import Paper from "@mui/material/Paper";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { RootState } from "../redux/rootReducer";
import { signupUserThunk } from "../redux/user/user.actions";
import useMediaQuery from "@mui/material/useMediaQuery";
import Alert from "@mui/material/Alert";
import RenderBackgroundImage from "../components/RenderBackgroundImage";
import { CircularProgress } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Image from "../assets/background/background3.jpg";

const SignUp: React.FC = () => {
  const dispatch = useDispatch() as ThunkDispatch<RootState, null, AnyAction>;
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setUsername("");
    setEmail("");
    setPassword("");
    setFormError("");
    setHasError(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !username.trim() ||
      !email.trim() ||
      !password.trim()
    ) {
      setFormError("All fields are required.");
      setHasError(true);
      return;
    }

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValidEmail) {
      setFormError("Invalid email address.");
      setHasError(true);
      return;
    }

    const isValidPassword = password.trim().length >= 6;
    if (!isValidPassword) {
      setFormError("Password must be at least 6 characters long.");
      setHasError(true);
      return;
    }
    setIsLoading(true);

    try {
      const userData = {
        name: `${firstName.trim()} ${lastName.trim()}`,
        username: username.trim(),
        email: email.trim(),
        password: password.trim(),
      };

      dispatch(signupUserThunk(userData));

      resetForm();
      navigate("/dashboard");
    } catch (error: any) {
      console.log(error.response.data);
      if (error.response.data === "Email already exists") {
        setFormError("Email exists. Please use a different email.");
      } else if (error.response.data === "Username already exists") {
        setFormError("Username exists. Please use a different email.");
      } else {
        setFormError("An error occurred. Please try again later.");
      }
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <RenderBackgroundImage imageSource={Image} low={30} high={70} />

      <Container
        component="main"
        maxWidth={isSmallScreen ? false : "sm"}
        sx={{
          padding: isSmallScreen ? 2 : 4,
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
            mt: isSmallScreen ? "20%" : "30%",
          }}
        >
          <Paper
            elevation={16}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: 3,
              opacity: 0.9,
              borderRadius: 3,
              transition: "box-shadow 0.2s",
              "&:hover": {
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                opacity: 0.95,
              },
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography
              component="h1"
              variant="h5"
              sx={{ fontFamily: "'Bungee', sans-serif" }}
            >
              Sign up
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 3 }}
            >
              <Grid container spacing={2}>
                <Grid item xs={6} sm={6}>
                  <TextField
                    autoComplete="given-name"
                    name="firstName"
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    autoFocus
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </Grid>
                <Grid item xs={6} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name="lastName"
                    autoComplete="family-name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    name="username"
                    autoComplete="user-name"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase())}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value.toLowerCase())}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sx={{ mt: -1 }}>
                  {hasError && <Alert severity="error">{formError}</Alert>}
                </Grid>
              </Grid>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  mb: 2,
                  p: 1.5,
                  fontFamily: "'Nova Square', sans-serif",
                }}
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={25} /> : "Sign Up"}
              </Button>
              <Grid container justifyContent="center">
                <Grid item>
                  <Link
                    href="/login"
                    variant="body2"
                    style={{
                      fontFamily: "'Lilita One', sans- serif",
                    }}
                  >
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Box>
      </Container>
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          width: "100%",
        }}
      >
        <Footer />
      </div>
    </>
  );
};

export default SignUp;
