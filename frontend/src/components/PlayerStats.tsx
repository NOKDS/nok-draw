import React from "react";
import { Paper, Typography } from "@mui/material";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import { useTheme } from "../context/ThemeContext";

interface Game {
  id: number;
  isWon: boolean;
  top3Predications: string;
  createdAt: string;
}

interface PlayerStatsProps {
  games: Game[];
}

const PlayerStats: React.FC<PlayerStatsProps> = ({ games }) => {
  const { darkMode } = useTheme();

  const stats = games.reduce(
    (acc, game) => {
      if (game.isWon) {
        acc.wins++;
      } else {
        acc.losses++;
      }
      return acc;
    },
    { wins: 0, losses: 0 } as { wins: number; losses: number }
  );

  return (
    <>
      <Paper
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderRadius: "1rem",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
          backgroundColor: darkMode ? "inherit" : "beige",
        }}
      >
        <Typography variant="h5" sx={{ color: "#007BFF", marginBottom: 2 }}>
          Player Stats
        </Typography>
        <Typography
          variant="body1"
          sx={{ fontSize: "1.1rem", marginBottom: 1 }}
        >
          Games Played: {games.length}
        </Typography>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            marginBottom: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              color: "green",
            }}
          >
            <SentimentVerySatisfiedIcon sx={{ marginRight: 1 }} />
            <Typography variant="body1" sx={{ fontSize: "18px" }}>
              Wins: {stats.wins}
            </Typography>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              color: "red",
            }}
          >
            <SentimentVeryDissatisfiedIcon sx={{ marginRight: 1 }} />
            <Typography variant="body1" sx={{ fontSize: "18px" }}>
              Losses: {stats.losses}
            </Typography>
          </div>
        </div>
      </Paper>
    </>
  );
};

export default PlayerStats;
