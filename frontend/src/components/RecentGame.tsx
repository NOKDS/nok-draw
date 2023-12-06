import React, { useEffect, useState } from "react";
import {
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import { useTheme } from "@mui/system";
import { useSelector } from "react-redux";
import { RootState } from "../redux/rootReducer";

const RecentGame: React.FC = () => {
  const theme = useTheme();
  const games = useSelector((state: RootState) => state.games.games);
  const lastGame = games[games.length - 1];
  console.log(lastGame);
  if (!lastGame) {
    return (
      <>
        <Typography
          variant="h5"
          sx={{
            textAlign: "center",
            color: "#007BFF",
            fontFamily: "'Audiowide', sans-serif",
          }}
        >
          Recent Game
        </Typography>
        <Divider sx={{ width: "100%", marginY: theme.spacing(2) }} />
        <Typography
          variant="body1"
          sx={{
            textAlign: "center",
            marginBottom: theme.spacing(2),
            fontFamily: "'Audiowide', sans-serif",
          }}
        >
          No game to display
        </Typography>
      </>
    );
  }

  const predictions = JSON.parse(games[games.length - 1].top3Predications);
  return (
    <>
      <Typography
        variant="h5"
        sx={{
          color: "#007BFF",
          marginBottom: theme.spacing(2),
          fontFamily: "'Audiowide', sans-serif",
        }}
      >
        Recent Game
      </Typography>
      <Divider sx={{ width: "100%", marginY: theme.spacing(2) }} />

      <Table>
        <TableBody>
          <TableRow>
            <TableCell colSpan={2}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: theme.spacing(1),
                  }}
                >
                  {lastGame.isWon ? (
                    <SentimentVerySatisfiedIcon
                      sx={{ color: "green", marginRight: theme.spacing(1) }}
                    />
                  ) : (
                    <SentimentVeryDissatisfiedIcon
                      sx={{ color: "red", marginRight: theme.spacing(1) }}
                    />
                  )}
                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: { xs: "16px", md: "18px" },
                      fontFamily: "'Rubik Bubbles', sans-serif",
                    }}
                  >
                    Result: {lastGame.isWon ? " Won" : " Lost"}
                  </Typography>
                </div>
              </div>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: "16px", md: "18px" },
                  fontFamily: "'Rubik Bubbles', sans-serif",
                  marginBottom: theme.spacing(1),
                }}
              >
                Category: {lastGame.category}
              </Typography>
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>
              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: "16px", md: "18px" },
                  fontFamily: "'Rubik Bubbles', sans-serif",
                  marginBottom: theme.spacing(1),
                }}
              >
                Top 4 Predictions: {predictions.join(", ")}
              </Typography>
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>
              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: "16px", md: "18px" },
                  fontFamily: "'Rubik Bubbles', sans-serif",
                }}
              >
                Date: {new Date(lastGame.createdAt).toLocaleDateString()}
              </Typography>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
};

export default RecentGame;
