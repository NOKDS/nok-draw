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
import { Typography } from "@mui/material";
import { useTheme } from "../context/ThemeContext";

interface Game {
  id: number;
  category: string;
  isWon: boolean;
  top3Predications: string;
  createdAt: string;
}

interface GamesProps {
  games: Game[];
}

const Games: React.FC<GamesProps> = ({ games }) => {
  const { darkMode } = useTheme();

  const gamesPerPage = 5;
  const [currentPage, setCurrentPage] = React.useState(1);

  const startRow = (currentPage - 1) * gamesPerPage + 1;
  const endRow = currentPage * gamesPerPage;

  const totalPages = Math.ceil(games.length / gamesPerPage);

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
    <React.Fragment>
      <Paper
        sx={{
          width: "100%",
          textAlign: "center",
          p: 2,
          backgroundColor: darkMode ? "inherit" : "beige",
          minHeight: "32vh",
        }}
      >
        <Typography variant="h5" sx={{ color: "#007BFF", marginBottom: 2 }}>
          Recent Games
        </Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ textAlign: "center" }}>ID</TableCell>
                <TableCell>Category</TableCell>
                <TableCell sx={{ textAlign: "center" }}>Result</TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  Top 4 Predications
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {games
                .slice(startRow - 1, endRow)
                .map((game: Game, index: number) => (
                  <TableRow key={game.id}>
                    <TableCell sx={{ textAlign: "center" }}>
                      {startRow + index}
                    </TableCell>
                    <TableCell>{game.category}</TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      {game.isWon ? (
                        <span style={{ color: "green" }}>Win</span>
                      ) : (
                        <span style={{ color: "red" }}>Loss</span>
                      )}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      {game.top3Predications}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        {totalPages > 1 && (
          <div style={{ textAlign: "center", marginTop: "1rem" }}>
            {currentPage > 1 && (
              <Link
                color="primary"
                href="#"
                onClick={handlePrevPage}
                sx={{
                  marginRight: "3rem",
                  display: "inline-block",
                  textDecoration: "none",
                  pointerEvents: currentPage > 1 ? "auto" : "none",
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
                }}
              >
                <ArrowCircleRightIcon />
              </Link>
            )}
          </div>
        )}
      </Paper>
    </React.Fragment>
  );
};

export default Games;
