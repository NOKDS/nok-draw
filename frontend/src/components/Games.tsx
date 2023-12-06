import * as React from "react";
import Link from "@mui/material/Link";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/system";
import { Divider } from "@mui/material";

interface Game {
  id: number;
  category: string;
  isWon: boolean;
  top4Predications: string;
  createdAt: string;
}

interface GamesProps {
  games: Game[];
}

const Games: React.FC<GamesProps> = ({ games }) => {
  const theme = useTheme();

  const gamesPerPage = 3;
  const [currentPage, setCurrentPage] = React.useState(1);

  const startRow = (currentPage - 1) * gamesPerPage + 1;
  const endRow = currentPage * gamesPerPage;
  const reversedGames = [...games].reverse();
  const totalPages = Math.ceil(games.length / gamesPerPage);
  const hasGames = games.length > 0;

  const handleNextPage = (event: React.MouseEvent) => {
    event.preventDefault();

    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = (event: React.MouseEvent) => {
    event.preventDefault();

    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <Paper
      elevation={4}
      sx={{
        padding: theme.spacing(2),
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
        Games History
      </Typography>
      <Divider sx={{ width: "100%", marginY: theme.spacing(2) }} />
      {hasGames ? (
        <TableContainer>
          <Table size="medium">
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    textAlign: "center",
                    padding: theme.spacing(5),
                    fontWeight: "bold",
                    fontSize: { xs: "1rem", md: "1.2rem" },
                    fontFamily: "'Nova Square', sans-serif",
                  }}
                >
                  ID
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "center",
                    padding: theme.spacing(3),
                    fontWeight: "bold",
                    fontSize: { xs: "1rem", md: "1.2rem" },
                    fontFamily: "'Nova Square', sans-serif",
                  }}
                >
                  Category
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "center",
                    padding: theme.spacing(3),
                    fontWeight: "bold",
                    fontSize: { xs: "1rem", md: "1.2rem" },
                    fontFamily: "'Nova Square', sans-serif",
                  }}
                >
                  Result
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "center",
                    padding: theme.spacing(3),
                    fontWeight: "bold",
                    fontSize: { xs: "1rem", md: "1.2rem" },
                    fontFamily: "'Nova Square', sans-serif",
                  }}
                >
                  Top 4 Predications
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reversedGames
                .slice(startRow - 1, endRow)
                .map((game: Game, index: number) => (
                  <TableRow key={game.id}>
                    <TableCell
                      sx={{
                        textAlign: "center",
                        padding: theme.spacing(2),
                        fontFamily: "'Rubik Bubbles', sans-serif",
                      }}
                    >
                      {startRow + index}
                    </TableCell>
                    <TableCell
                      sx={{
                        textAlign: "center",
                        padding: theme.spacing(2),
                        fontFamily: "'Rubik Bubbles', sans-serif",
                      }}
                    >
                      {game.category}
                    </TableCell>
                    <TableCell
                      sx={{
                        textAlign: "center",
                        padding: theme.spacing(2),
                        fontFamily: "'Rubik Bubbles', sans-serif",
                      }}
                    >
                      {game.isWon ? (
                        <span style={{ color: "green" }}>Win</span>
                      ) : (
                        <span style={{ color: "red" }}>Loss</span>
                      )}
                    </TableCell>
                    <TableCell
                      sx={{
                        textAlign: "center",
                        padding: theme.spacing(2),
                        fontFamily: "'Rubik Bubbles', sans-serif",
                      }}
                    >
                      {JSON.parse(game.top4Predications).map(
                        (animal: string, index: number) => (
                          <span key={index} style={{ margin: "0 4px" }}>
                            {animal}
                            {index < game.top4Predications.length - 1 && ","}
                          </span>
                        )
                      )}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography
          variant="body1"
          sx={{
            textAlign: "center",
            fontFamily: "'Audiowide', sans-serif",
          }}
        >
          No history
        </Typography>
      )}
      {totalPages > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: theme.spacing(2),
          }}
        >
          {currentPage > 1 && (
            <Link
              color="primary"
              href="#"
              onClick={handlePrevPage}
              sx={{
                display: "inline-block",
                textDecoration: "none",
                pointerEvents: currentPage > 1 ? "auto" : "none",
                marginRight: theme.spacing(1),
              }}
            >
              <ArrowCircleLeftIcon />
            </Link>
          )}
          {currentPage < totalPages && (
            <Link
              color="primary"
              href="#"
              onClick={handleNextPage}
              sx={{
                display: "inline-block",
                textDecoration: "none",
                pointerEvents: currentPage < totalPages ? "auto" : "none",
                marginLeft: theme.spacing(1),
              }}
            >
              <ArrowCircleRightIcon />
            </Link>
          )}
        </div>
      )}
    </Paper>
  );
};

export default Games;
