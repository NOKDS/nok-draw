import { useEffect, useRef, useState, useCallback } from "react";
import {
  Box,
  Container,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  CircularProgress,
  Grid,
} from "@mui/material";
import { RootState } from "../redux/rootReducer";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { useDispatch, useSelector } from "react-redux";
import CircularProgressWithLabel from "./CircularProgressWithLabel";

import { pencilCursor, eraserCursor } from "../assets/cursors";
import { useTheme } from "../context/ThemeContext";
import CategoryPicker from "./CategoryPicket";
import CanvasToolBar from "./CanvasToolBar";
import {
  fetchGamesThunk,
  guestPredictDrawingThunk,
  userPredictDrawingThunk,
} from "../redux/games/games.actions";
import StartButton from "../assets/start-button/start-button1.svg";
import { useNavigate } from "react-router-dom";
import RecentGame from "./RecentGame";

const SinglePlayerCanvas = () => {
  const dispatch = useDispatch() as ThunkDispatch<RootState, null, AnyAction>;
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
  const { darkMode } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isErasing, setIsErasing] = useState(false);
  const [shouldClearCanvas, setShouldClearCanvas] = useState(false);
  const [timer, setTimer] = useState(0);
  const [startButtonVisible, setStartButtonVisible] = useState(true);
  const [hasSubmittedDrawing, setHasSubmittedDrawing] = useState(false);
  const selectedCategory = useRef<string>("");
  const [responseDialogOpen, setResponseDialogOpen] = useState(false);
  const [processing, setProcessing] = useState(false);

  const handleOpenResponseDialog = () => {
    setResponseDialogOpen(true);
  };

  const handleCloseResponseDialog = () => {
    setResponseDialogOpen(false);
  };

  const handleCategorySelect = (category: string) => {
    selectedCategory.current = category;
  };

  const draw = useCallback(
    (event: MouseEvent | TouchEvent) => {
      event.preventDefault();
      if (timer > 0 && isDrawing) {
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
            ((event.touches[0].clientX - rect.left) / rect.width) *
            canvas.width;
          y = (event.touches[0].clientY / rect.height) * canvas.height;
        } else {
          return;
        }

        ctx.lineWidth = isErasing ? 20 : 5;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
      }
    },
    [isDrawing, isErasing, timer]
  );

  const clearCanvas = useCallback(() => {
    setShouldClearCanvas(true);
  }, []);

  const startDrawingHandler = useCallback(() => {
    if (timer > 0) setIsDrawing(true);
  }, [timer]);

  const stopDrawingHandler = useCallback(() => {
    setIsDrawing(false);
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) ctx.beginPath();
  }, []);

  const startGameTimer = useCallback(() => {
    setStartButtonVisible(false);
    setTimer(15);
    setHasSubmittedDrawing(false);
    setIsDrawing(false);
    setIsErasing(false);
    setShouldClearCanvas(true);
    setProcessing(false);
    handleCloseResponseDialog();
    const countdown = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer === 0) {
          clearInterval(countdown);
          submitDrawing();
          clearCanvas();
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);
  }, [clearCanvas]);

  const submitDrawing = async () => {
    if (hasSubmittedDrawing) return;
    setProcessing(true);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const imageData = canvas.toDataURL();
    const roomName = "test";
    const userId = "1";
    const data = {
      canvas_data: imageData,
      room_name: roomName,
      user_id: userId,
      category: selectedCategory.current,
    };
    try {
      setHasSubmittedDrawing(true);
      setStartButtonVisible(true);
      if (isLoggedIn) {
        await dispatch(userPredictDrawingThunk(data));
        dispatch(fetchGamesThunk());
      } else {
        await dispatch(guestPredictDrawingThunk(data));
      }

      handleOpenResponseDialog();
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setProcessing(false);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.globalCompositeOperation = isErasing
      ? "destination-out"
      : "source-over";
    return () => {
      ctx.globalCompositeOperation = "source-over";
    };
  }, [isErasing]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas === null) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (shouldClearCanvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setShouldClearCanvas(false);
    }
  }, [shouldClearCanvas]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const startDrawing = () => {
      startDrawingHandler();
      canvas.removeEventListener("mousedown", startDrawing);
      canvas.removeEventListener("touchstart", startDrawing);
    };

    const stopDrawing = () => {
      stopDrawingHandler();
      canvas.removeEventListener("mouseup", stopDrawing);
      canvas.removeEventListener("touchend", stopDrawing);
    };

    const handleDraw = (event: MouseEvent | TouchEvent) => {
      event.preventDefault();
      draw(event);
    };

    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mousemove", handleDraw);

    canvas.addEventListener("touchstart", startDrawing);
    canvas.addEventListener("touchend", stopDrawing);
    canvas.addEventListener("touchmove", handleDraw);

    return () => {
      canvas.removeEventListener("mousedown", startDrawing);
      canvas.removeEventListener("mouseup", stopDrawing);
      canvas.removeEventListener("mousemove", handleDraw);

      canvas.removeEventListener("touchstart", startDrawing);
      canvas.removeEventListener("touchend", stopDrawing);
      canvas.removeEventListener("touchmove", handleDraw);
    };
  }, [startDrawingHandler, stopDrawingHandler, draw]);

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {processing && (
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 2,
          }}
        >
          <CircularProgress size={60} />
        </Box>
      )}

      {startButtonVisible && !processing && (
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Button
            sx={{
              transition: "transform 0.3s ease-in-out",

              "&:hover": {
                backgroundColor: "transparent",
                boxShadow: "none",
                cursor: "pointer",
                transform: "scale(1.5)",
              },
            }}
            disableRipple
            onClick={startGameTimer}
          >
            <img
              src={StartButton}
              alt="Start Drawing"
              style={{
                width: "100%",
                height: "100%",
                pointerEvents: "none",
              }}
            />
          </Button>
        </Box>
      )}
      {!startButtonVisible && !processing && (
        <div
          style={{
            zIndex: "1",
          }}
        >
          <Box sx={{ mt: 3, zIndex: 1 }}>
            <CircularProgressWithLabel value={(timer / 15) * 100} />
          </Box>
          <Box sx={{ zIndex: 1 }}>
            <CategoryPicker onSelectCategory={handleCategorySelect} />
          </Box>
          <Box sx={{ zIndex: 1 }}>
            <CanvasToolBar
              isErasing={isErasing}
              darkMode={darkMode}
              setIsErasing={setIsErasing}
              clearCanvas={clearCanvas}
            />
          </Box>
        </div>
      )}
      <canvas
        style={{
          border: "1px solid #ccc",
          cursor: isErasing
            ? `url('${eraserCursor}'), auto`
            : `url('${pencilCursor}'), auto`,
          background: darkMode ? "#2c2c2c" : "#f0f0f0",
          width: window.innerWidth,
          height: window.innerHeight,
          position: "absolute",
          backgroundColor: darkMode ? "silver" : "default",
          top: 0,
          left: 0,
          visibility: startButtonVisible ? "hidden" : "visible",
        }}
        width={window.innerWidth}
        height={window.innerHeight}
        ref={canvasRef}
      >
        <Dialog
          open={responseDialogOpen}
          onClose={handleCloseResponseDialog}
          aria-labelledby="response-dialog-title"
          aria-describedby="response-dialog-description"
        >
          {" "}
          <DialogContent>
            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={12}>
                <RecentGame />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Grid container justifyContent="center">
              <Button onClick={handleCloseResponseDialog} color="primary">
                Close
              </Button>
            </Grid>
          </DialogActions>
        </Dialog>
      </canvas>
    </Container>
  );
};

export default SinglePlayerCanvas;
