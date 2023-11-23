import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  CssBaseline,
  IconButton,
  Box,
  Typography,
  Container,
  Button,
} from "@mui/material";
import { Draw, AutoFixHigh, Clear } from "@mui/icons-material";
import { useTheme } from "../context/ThemeContext";
import { pencilCursor, eraserCursor } from "../assets/cursors";
import CircularProgressWithLabel from "./CircularProgressWithLabel";

const SinglePlayerCanvas = () => {
  const { darkMode } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isErasing, setIsErasing] = useState(false);
  const [shouldClearCanvas, setShouldClearCanvas] = useState(false);
  // const [submittedDrawing, setSubmittedDrawing] = useState<string | null>(null);
  const [timer, setTimer] = useState(10);
  const [startButtonVisible, setStartButtonVisible] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    if (!startButtonVisible) {
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
    }
  }, [isDrawing, startButtonVisible]);

  const startTimerAndHideButton = () => {
    setStartButtonVisible(false);

    const countdown = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer === 1) {
          clearInterval(countdown);
          submitDrawing();
          clearCanvas();
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);
  };

  const startDrawing = useCallback(() => setIsDrawing(true), []);
  const stopDrawing = useCallback(() => {
    setIsDrawing(false);
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) ctx.beginPath();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas === null) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.globalCompositeOperation = isErasing
      ? "destination-out"
      : "source-over";
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
      ctx.lineWidth = isErasing ? 20 : 5;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y);
    },
    [isDrawing, isErasing]
  );

  const clearCanvas = () => {
    setShouldClearCanvas(true);
  };

  // const resizeImage = (image: HTMLImageElement, newSize: number): string => {
  //   const canvas = document.createElement("canvas");
  //   const ctx = canvas.getContext("2d");

  //   if (!ctx) {
  //     throw new Error("Unable to get 2D context");
  //   }

  //   const { width, height } = image;
  //   canvas.width = newSize;
  //   canvas.height = newSize;
  //   const scaleFactor = newSize / Math.max(width, height);
  //   const newWidth = width * scaleFactor;
  //   const newHeight = height * scaleFactor;
  //   const xOffset = (newSize - newWidth) / 2;
  //   const yOffset = (newSize - newHeight) / 2;
  //   ctx.drawImage(image, xOffset, yOffset, newWidth, newHeight);
  //   return canvas.toDataURL();
  // };

  // const shortenDataURL = (dataURL: string) => {
  //   const base64Data = dataURL.split(",")[1];
  //   const binaryData = atob(base64Data);
  //   const uint8Array = new Uint8Array(binaryData.length);
  //   for (let i = 0; i < binaryData.length; i++) {
  //     uint8Array[i] = binaryData.charCodeAt(i);
  //   }

  //   const compressedBase64 = btoa(
  //     String.fromCharCode.apply(null, Array.from(uint8Array))
  //   );
  //   const shortenedDataURL = `data:image/png;base64,${compressedBase64}`;
  //   return shortenedDataURL;
  // };

  // const submitDrawing = () => {
  //   const canvas = canvasRef.current;
  //   if (canvas) {
  //     const imageData = canvas.toDataURL();
  //     const tempImage = new Image();
  //     tempImage.src = imageData;

  //     tempImage.onload = () => {
  //       try {
  //         const resizedImageData = resizeImage(tempImage, 28);
  //         const shortenedImageData = shortenDataURL(resizedImageData);
  //         console.log("Resized and Shortened Image Data:", shortenedImageData);
  //         setSubmittedDrawing(shortenedImageData);
  //       } catch (error) {
  //         console.error("Error during image resizing:", error);
  //       }
  //     };
  //   }
  // };
  const submitDrawing = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const imageData = canvas.toDataURL();
      const roomName = "hi";
      const userId = "1";
      const data = {
        canvas_data: imageData,
        room_name: roomName,
        user_id: userId,
      };

      fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((error) => console.error("Error:", error));
    }
  };

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
      {startButtonVisible && (
        <Button
          sx={{
            zIndex: 1,
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            padding: "10px 20px",
            fontSize: ["1rem", "1.5rem"],
            fontWeight: "bold",
            color: "#4CAF50",
            border: "2px solid #4CAF50",
            borderRadius: "8px",
            cursor: "pointer",
            transition: "color 0.3s ease, border-color 0.3s ease",
            "&:hover": {
              color: "#45a049",
              borderColor: "#45a049",
              cursor: "pointer",
            },
          }}
          onClick={startTimerAndHideButton}
        >
          Start Drawing
        </Button>
      )}
      {!startButtonVisible && (
        <>
          <Box sx={{ mt: 3, zIndex: 2 }}>
            <CircularProgressWithLabel value={(timer / 60) * 100} />
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 3,
              zIndex: 2,
              mt: 1,
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
                color={
                  isErasing ? (darkMode ? "secondary" : "primary") : "default"
                }
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
                color={
                  isErasing ? "default" : darkMode ? "secondary" : "primary"
                }
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
        </>
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
      ></canvas>
    </Container>
  );
};

export default SinglePlayerCanvas;
