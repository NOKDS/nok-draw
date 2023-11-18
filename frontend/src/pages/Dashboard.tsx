import React, { useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import {
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  Paper,
  Typography,
} from "@mui/material";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import PlayerStats from "../components/PlayerStats";
import { useNavigate } from "react-router-dom";
import RenderBackgroundImage from "../components/RenderBackgroundImage";
import Image from "../assets/background.jpg";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/rootReducer";
import { fetchUser, fetchUserThunk } from "../redux/user/user.actions";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";

const Dashboard: React.FC = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const theme = useTheme();
  const dispatch = useDispatch() as ThunkDispatch<RootState, null, AnyAction>;
  const navigate = useNavigate();

  const handleAvatarClick = () => {
    navigate("/dashboard/avatar");
  };

  useEffect(() => {
    const cachedUser = localStorage.getItem("cachedUser");

    if (cachedUser) {
      dispatch(fetchUser(JSON.parse(cachedUser)));
    } else {
      dispatch(fetchUserThunk());
    }
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("cachedUser", JSON.stringify(user));
    }
  }, [user]);

  return (
    <>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <RenderBackgroundImage imageSource={Image} low={40} high={80} />
        <CssBaseline />
        <Container maxWidth="md" sx={{ pt: 15 }}>
          <Paper
            elevation={8}
            sx={{ padding: theme.spacing(4), textAlign: "center" }}
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
                  width: 200,
                  height: 200,
                  mb: 2,
                  mt: -15,
                  "&:hover": {
                    border: "2px solid #007BFF",
                    transform: "scale(1.05)",
                    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
                  },
                }}
              />
            </Button>
            <Typography component="h1" variant="h4" mb={2}>
              Welcome, {user.name}!
            </Typography>
            <Typography variant="body1" color="textSecondary" mb={4}>
              {user.email} | @{user.username}
            </Typography>
            <PlayerStats username={"hoho"} />
            <Button
              variant="contained"
              color="primary"
              href="/play"
              startIcon={<SportsEsportsIcon />}
              sx={{ width: "100%", mt: 4 }}
            >
              Play Now
            </Button>
          </Paper>
        </Container>
      </Box>
    </>
  );
};

export default Dashboard;
