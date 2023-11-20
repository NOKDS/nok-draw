import {
  CssBaseline,
  IconButton,
  Box,
  Typography,
  Container,
  Button,
} from "@mui/material";
import { Draw, AutoFixHigh, Clear } from "@mui/icons-material";
import { useEffect, useRef, useState, useCallback } from "react";
import { pencilCursor, eraserCursor } from "../assets/cursors";
import { useTheme } from "../context/ThemeContext";
// import LightPencilCursor from "../assets/pencil1.png";
// import DarkPencilCursor from "../assets/pencil2.png";
// import DarkEraserCursor from "../assets/eraser2.png";
// import LightEraserCursor from "../assets/eraser1.png";

const SinglePlayerCanvas = () => {
  const { darkMode } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isErasing, setIsErasing] = useState(false);
  const [shouldClearCanvas, setShouldClearCanvas] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas === null) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (shouldClearCanvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setShouldClearCanvas(false);
    }

    ctx.lineWidth = 1;
    ctx.lineCap = "round";
  }, [shouldClearCanvas]);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas === null) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.lineWidth = isErasing ? 18 : 1;
    ctx.globalCompositeOperation = isErasing
      ? "destination-out"
      : "source-over";
  }, [isErasing]);

  const startDrawing = useCallback(() => setIsDrawing(true), []);
  const stopDrawing = useCallback(() => {
    setIsDrawing(false);
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) ctx.beginPath();
  }, []);

  const draw = useCallback(
    (event: MouseEvent | TouchEvent) => {
      event.preventDefault();
      if (!isDrawing) return;

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!ctx || !canvas) return;
      const rect = canvas.getBoundingClientRect();

      let x, y;

      if (event instanceof MouseEvent) {
        x = ((event.clientX - rect.left) / rect.width) * canvas.width;
        y = (event.clientY / rect.height) * canvas.height;
      } else if (event.touches && event.touches.length > 0) {
        x =
          ((event.touches[0].clientX - rect.left) / rect.width) * canvas.width;
        y = (event.touches[0].clientY / rect.height) * canvas.height;
      } else {
        return;
      }

      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y);
    },
    [isDrawing]
  );

  const clearCanvas = () => {
    setShouldClearCanvas(true);
  };

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mousemove", draw);

    canvas.addEventListener("touchstart", startDrawing);
    canvas.addEventListener("touchend", stopDrawing);
    canvas.addEventListener("touchmove", draw);

    return () => {
      canvas.removeEventListener("mousedown", startDrawing);
      canvas.removeEventListener("mouseup", stopDrawing);
      canvas.removeEventListener("mousemove", draw);

      canvas.addEventListener("touchstart", startDrawing);
      canvas.addEventListener("touchend", stopDrawing);
      canvas.addEventListener("touchmove", draw);
    };
  }, [startDrawing, stopDrawing, draw]);

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 3,
          zIndex: 2,
          mt: 10,
        }}
      >
        <Button
          onClick={() => setIsErasing(true)}
          sx={{
            "&:hover": { backgroundColor: "transparent" },
          }}
          disableTouchRipple
        >
          <IconButton
            color={isErasing ? (darkMode ? "secondary" : "primary") : "default"}
            size="large"
          >
            <AutoFixHigh sx={{ mb: 1.5 }} />
          </IconButton>
          <Typography
            variant="caption"
            sx={{
              color: darkMode ? "white" : "black",
            }}
          >
            Eraser
          </Typography>
        </Button>

        <Button
          onClick={() => setIsErasing(false)}
          sx={{
            "&:hover": { backgroundColor: "transparent" },
          }}
          disableTouchRipple
        >
          <IconButton
            color={isErasing ? "default" : darkMode ? "secondary" : "primary"}
            size="large"
          >
            <Draw sx={{ mb: 1 }} />
          </IconButton>
          <Typography
            variant="caption"
            sx={{
              color: darkMode ? "white" : "black",
            }}
          >
            Pencil
          </Typography>
        </Button>

        <Button
          onClick={clearCanvas}
          sx={{
            "&:hover": { backgroundColor: "transparent" },
          }}
          disableTouchRipple
        >
          <IconButton color={darkMode ? "error" : "warning"} size="large">
            <Clear sx={{ mb: 0.5 }} />
          </IconButton>
          <Typography
            variant="caption"
            sx={{
              color: darkMode ? "white" : "black",
            }}
          >
            Clear
          </Typography>
        </Button>
      </Box>
      <canvas
        style={{
          border: "1px solid #ccc",
          cursor: isErasing
            ? `url('${eraserCursor}'), auto`
            : `url('${pencilCursor}'), auto`,
          background: darkMode ? "#2c2c2c" : "#f0f0f0",
          width: "100vw",
          height: "100vh",
          position: "absolute",
          backgroundColor: darkMode ? "silver" : "default",
          top: 0,
          left: 0,
        }}
        width={1000}
        height={1000}
        ref={canvasRef}
      ></canvas>
    </Container>
  );
};

export default SinglePlayerCanvas;
