import React from "react";
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

  if (!lastGame) {
    return (
      <div>
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
            fontFamily: "'Audiowide', sans-serif",
          }}
        >
          No game to display
        </Typography>
      </div>
    );
  }

  const predictions = JSON.parse(lastGame.top4Predications);

  return (
    <Paper
      elevation={4}
      sx={{
        padding: theme.spacing(4),
        textAlign: "center",
        borderRadius: "1rem",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        position: "relative",
        overflow: "hidden",
        height: "100%",
      }}
    >
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
            <TableCell>
              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: "1.0rem", md: "1.1rem" },
                  fontFamily: "'Nova Square', sans-serif",
                }}
              >
                Result:
              </Typography>
            </TableCell>
            <TableCell>
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: theme.spacing(1),
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: { xs: "1.0rem", md: "1.1rem" },
                      fontFamily: "'Rubik Bubbles', sans-serif",
                    }}
                  >
                    {lastGame.isWon ? "Won" : "Lost"}
                  </Typography>
                  {lastGame.isWon ? (
                    <SentimentVerySatisfiedIcon
                      sx={{ color: "green", marginLeft: theme.spacing(1) }}
                    />
                  ) : (
                    <SentimentVeryDissatisfiedIcon
                      sx={{ color: "red", marginLeft: theme.spacing(1) }}
                    />
                  )}
                </div>
              </div>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: "1.0rem", md: "1.1rem" },
                  fontFamily: "'Nova Square', sans-serif",
                  marginBottom: theme.spacing(1),
                }}
              >
                Category:
              </Typography>
            </TableCell>
            <TableCell>
              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: "1.0rem", md: "1.1rem" },
                  fontFamily: "'Rubik Bubbles', sans-serif",
                }}
              >
                {lastGame.category}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: "1.0rem", md: "1.1rem" },
                  fontFamily: "'Nova Square', sans-serif",
                  marginBottom: theme.spacing(1),
                }}
              >
                Top 4 Predictions:
              </Typography>
            </TableCell>
            <TableCell>
              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: "1.0rem", md: "1.1rem" },
                  fontFamily: "'Rubik Bubbles', sans-serif",
                }}
              >
                {predictions.map((prediction: string, index: number) => (
                  <div key={index}>
                    {prediction}
                    {index < predictions.length - 1 && <br />}
                  </div>
                ))}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: "1.0rem", md: "1.1rem" },
                  fontFamily: "'Nova Square', sans-serif",
                }}
              >
                Date:
              </Typography>
            </TableCell>
            <TableCell>
              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: "1.0rem", md: "1.1rem" },
                  fontFamily: "'Rubik Bubbles', sans-serif",
                }}
              >
                {new Date(lastGame.createdAt).toLocaleDateString()}
              </Typography>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Paper>
  );
};

export default RecentGame;
