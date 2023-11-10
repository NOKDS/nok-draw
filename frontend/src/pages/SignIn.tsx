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
import Paper from "@mui/material/Paper";
import Footer from "../components/Footer";
import RenderVideoBackground from "../components/RenderVideoBackground";
import GoogleLoginButton from "../components/GoogleLoginButton";
import { loginUserThunk } from "../redux/user/user.actions";

// @ts-ignore
import Video from "../assets/BackgroundVideo2.mp4";
import Alert from "@mui/material/Alert";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";

import { RootState } from "../redux/rootReducer";

export default function SignIn() {
  const dispatch = useDispatch() as ThunkDispatch<RootState, null, AnyAction>;
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [hasError, setHasError] = useState(false);

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setFormError("");
    setSubmitted(false);
    setHasError(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    setSubmitted(true);

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email as string);
    const isValidPassword = (password as string).trim() !== "";

    if (!isValidEmail || !isValidPassword) {
      setFormError("Invalid email/username or password.");
      setHasError(true);
      return;
    }

    const userData = {
      email: isValidEmail ? (email as string) : null,
      username: isValidEmail ? null : (email as string),
      password: password as string,
    };

    if (!userData.email && !userData.username) {
      setFormError("Please enter a valid email or username.");
      setHasError(true);
      return;
    }
    try {
      await dispatch(loginUserThunk(userData));
      console.log(userData);
      resetForm();
      navigate("/profile");
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        setFormError("Invalid email/username or password.");
      } else {
        setFormError("An error occurred. Please try again later.");
      }
      setHasError(true);
    }
  };

  return (
    <>
      <RenderVideoBackground videoSource={Video} low={30} high={70} />

      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
          }}
        >
          <Paper
            elevation={16}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: 2,
              opacity: 0.8,
              borderRadius: 3,
              transition: "box-shadow 0.2s",
              "&:hover": {
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                opacity: 0.95,
              },
            }}
          >
            <Avatar sx={{ m: 2, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 2, p: 2 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {hasError && <Alert severity="error">{formError}</Alert>}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, p: 1.5 }}
              >
                Sign In
              </Button>
              <GoogleLoginButton />
              <Button></Button>
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="/signup" variant="body2">
                    {"Don't have an account? Sign Up"}
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
}
