import React, { useEffect, useCallback } from "react";
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
import { Link, useNavigate } from "react-router-dom";
import RenderBackgroundImage from "../components/RenderBackgroundImage";
import Image from "../assets/background.jpg";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/rootReducer";
import { fetchUserThunk } from "../redux/user/user.actions";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { fetchGamesThunk } from "../redux/games/games.actions";
import Games from "../components/Games";

const Dashboard: React.FC = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const games = useSelector((state: RootState) => state.games.games);
  const theme = useTheme();
  const dispatch = useDispatch() as ThunkDispatch<RootState, null, AnyAction>;
  const navigate = useNavigate();

  const handleAvatarClick = () => {
    navigate("/dashboard/avatar");
  };

  const fetchData = useCallback(async () => {
    // try {
    //   const cachedUser = localStorage.getItem("cachedUser");
    //   const cachedGames = localStorage.getItem("cachedGames");
    //   if (cachedUser) {
    //     const parsedCachedUser = JSON.parse(cachedUser);
    //     if (!user || parsedCachedUser.id !== user.id) {
    //       await dispatch(fetchUserThunk());
    //     }
    //   } else {
    await dispatch(fetchUserThunk());
    // }

    // if (user && cachedGames) {
    //   const parsedCachedGames = JSON.parse(cachedGames);
    //   if (
    //     !games ||
    //     JSON.stringify(parsedCachedGames) !== JSON.stringify(games)
    //   ) {
    //     // if (!games || parsedCachedGames.createdAt !== games[0]?.createdAt) {
    //     await dispatch(fetchGamesThunk());
    //   }
    // } else {
    await dispatch(fetchGamesThunk());
    //   }
    // } catch (error) {
    //   console.error("Error fetching user or games:", error);
    // }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("cachedUser", JSON.stringify(user));
    }
  }, [user]);

  useEffect(() => {
    if (games) {
      localStorage.setItem("cachedGames", JSON.stringify(games));
    }
  }, [games]);

  return (
    <div style={{ minHeight: "100vh", position: "relative" }}>
      <RenderBackgroundImage imageSource={Image} low={40} high={80} />
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CssBaseline />
        <Container maxWidth="md" sx={{ pt: 25 }}>
          <Paper
            elevation={8}
            sx={{ padding: theme.spacing(2), textAlign: "center" }}
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
                    "&::after": {
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
            <Typography component="h1" variant="h4" mb={2}>
              Welcome, {user.name}!
            </Typography>
            <Typography variant="body1" color="textSecondary" mb={4}>
              {user.email} | @{user.username}
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 1,
                mt: 3,
              }}
            >
              <Button
                variant="contained"
                color="primary"
                component={Link}
                to="/playSmode"
                startIcon={<SportsEsportsIcon />}
                sx={{ width: "50%" }}
              >
                Play Single player Mode
              </Button>
              <Button
                variant="outlined"
                color="primary"
                component={Link}
                to="/playMmode"
                startIcon={<SportsEsportsIcon />}
                sx={{ width: "50%" }}
              >
                Play Multiplayer Mode
              </Button>
            </Box>
          </Paper>
        </Container>
        <Container maxWidth="md" sx={{ mt: 5, mb: 5 }}>
          <Paper
            elevation={8}
            sx={{ padding: theme.spacing(2), textAlign: "center" }}
          >
            <PlayerStats games={games} />
          </Paper>
          <Paper
            elevation={8}
            sx={{
              padding: theme.spacing(2),
              mt: 2,
              p: 2,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Games games={games} />
          </Paper>
        </Container>
      </Box>
    </div>
  );
};

export default Dashboard;
