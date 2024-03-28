import CircularProgress, {
  CircularProgressProps,
} from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useTheme } from "../context/ThemeContext";

function CircularProgressWithLabel(
  props: CircularProgressProps & { value: number }
) {
  const { darkMode, theme } = useTheme();
  const seconds = Math.round(props.value / (100 / 15));
  return (
    <Box
      sx={{
        position: "relative",
        mb: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CircularProgress
        variant="determinate"
        size={70}
        thickness={2}
        sx={{
          color:
            seconds <= 10
              ? darkMode
                ? "error.light"
                : "error.light"
              : darkMode
              ? theme.palette.revPrimary.main
              : theme.palette.revPrimary.main,
        }}
        {...props}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            color:
              seconds <= 10
                ? darkMode
                  ? theme.palette.error.main
                  : theme.palette.error.main
                : darkMode
                ? theme.palette.revPrimary.main
                : theme.palette.revPrimary.main,
          }}
        >
          {seconds > 9 ? seconds : `${seconds}`}
        </Typography>
      </Box>
    </Box>
  );
}

export default CircularProgressWithLabel;
