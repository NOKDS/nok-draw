import React, { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import UserCanvas from "../Classes/UserClass";
import { io, Socket } from "socket.io-client";
import { pencilCursor, eraserCursor } from "../assets/cursors";
/*
There will be multiple canvases on this page. The
usersCanvas object holds uuid ids as keys and their
values as refs to html canvases. Through this object
we can easily access the canvas options, and pixel data.
*/
const MultiplayerMode = () => {
  // refs and state variables
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // user id that remains CONSTANT across re-renders
  const userId = useRef(uuidv4()).current;
  // array holding the canvasRef pairs.
  // Map over this array to place all canvases
  // on the board.
  const userCanvasesRef = useRef<Map<string, UserCanvas>>(new Map());
  const [userCanvases, setUserCanvases] = useState<Map<string, UserCanvas>>(
    new Map()
  );
  const [draw, setDraw] = useState(0);
  const drawRef = useRef(0);
  // const [userCanvases, setUserCanvases] = useState<UserCanvas[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isErasing, setIsErasing] = useState(false);
  const socketRef = useRef<any | null>(null);
  const roomnameRef = useRef<string>("");
  // TRY LIGHT BLUE FILL
  // sets up initial drawing settings
  // (stroke color, line width, fill color)
  useEffect(() => {
    // get the canvas element from the ref
    const canvas: HTMLCanvasElement | null = canvasRef.current;

    // The users canvas will be the first in the array.
    const newUserCanvas = new UserCanvas(canvasRef, userId);
    // Create a new Map for immutability
    if (userCanvasesRef.current) {
      const updatedCanvases = new Map(userCanvasesRef.current);
      updatedCanvases.set(userId, newUserCanvas);
      console.log("USERS", userCanvasesRef.current);
      userCanvasesRef.current = updatedCanvases;
      setUserCanvases(userCanvasesRef.current);
    }
    if (canvas === null) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 1; // Initial settings
    ctx.strokeStyle = "black";
    ctx.lineCap = "round"; // Round end caps for lines
  }, []);

  // if erasing change font and color
  useEffect(() => {
    // get the canvas element from the ref
    const canvas: HTMLCanvasElement | null = canvasRef.current;

    if (canvas === null) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.lineWidth = isErasing ? 18 : 1; // Initial settings
    ctx.strokeStyle = isErasing ? "white" : "black";
    ctx.lineCap = "round"; // Round end caps for lines
  }, [isErasing]);

  useEffect(() => {
    if (!userCanvases.size) return;
    const userCanvas: UserCanvas | null | undefined = userCanvases.get(userId)
      ? userCanvases.get(userId)
      : null;
    if (userCanvas === null || userCanvas === undefined) return;

    const ctx = userCanvas.getCtx();
    if (!ctx) return;

    const canvas: HTMLCanvasElement | null = userCanvas.canvasRef.current;
    if (!canvas) return;
    const startDrawing = () => setIsDrawing(true);

    const stopDrawing = () => {
      setIsDrawing(false);
      ctx.beginPath();
    };

    const draw = (event: MouseEvent) => {
      if (!isDrawing) return;
      const x = event.clientX - canvas.offsetLeft;
      const y = event.clientY - canvas.offsetTop;

      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y);
    };

    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mousemove", draw);

    return () => {
      canvas.removeEventListener("mousedown", startDrawing);
      canvas.removeEventListener("mouseup", stopDrawing);
      canvas.removeEventListener("mousemove", draw);
    };
  }, [userCanvases, isDrawing]);

  useEffect(() => {
    socketRef.current = io("http://localhost:8080");
    setInterval(() => {
      if (!userCanvasesRef.current) return;
      const base64Img = userCanvasesRef.current!.get(userId)?.encodetoBase64();
      socketRef.current.emit("canvasData", {
        base64Img,
        userId,
        roomName: roomnameRef.current,
      });
      console.log("sent canvas data");
    }, 500);
    // Join the game
    socketRef.current.emit("joinGame", userId);

    //   Listen for other users joining
    socketRef.current.on("users", (userIds: string[]) => {
      // create new user
      if (userCanvasesRef.current) {
        const updatedCanvases = new Map(userCanvasesRef.current);
        for (let id of userIds) {
          if (!updatedCanvases.get(id)) {
            const newUserCanvas = new UserCanvas(React.createRef(), id);
            updatedCanvases.set(id, newUserCanvas);
          }
        }
        userCanvasesRef.current = updatedCanvases;
        setUserCanvases(userCanvasesRef.current);
      }
    });

    socketRef.current.on("serverDraw", (data: any) => {
      // console.log('Received canvas blob data from server.', data.blob);

      // when you get back the blob then paint it onto the respective
      // users canvas.
      if (!userCanvasesRef.current) return;
      console.log("b");
      const UserObject = userCanvasesRef.current.get(data.userId);
      console.log("c");
      console.log("user object", UserObject);
      if (!UserObject) return;
      console.log("d");
      if (UserObject.canvasRef.current) {
        console.log("Updating canvas.");
        UserObject.updateCanvasFromData(data.base64Img);
        setDraw(drawRef.current + 1);
        console.log("Finished Updating");
      }
    });

    socketRef.current.on("assignedRoom", (data: any) => {
      console.log("got room name", data.roomName);
      roomnameRef.current = data.roomName;
    });

    // this will get all previous users if there are any and
    // add them to the list.

    socketRef.current.on("previousUsers", (userList: string[]) => {
      if (userCanvasesRef.current) {
        const updatedCanvases = new Map(userCanvasesRef.current);

        userList.forEach((userId) => {
          if (!updatedCanvases.get(userId)) {
            const newUser = new UserCanvas(React.createRef(), userId);
            updatedCanvases.set(userId, newUser);
          }
        });
        userCanvasesRef.current = updatedCanvases;
        setUserCanvases(userCanvasesRef.current);
      }
    });

    // socketRef.current.on('assignedRoom', (data: any) => {
    //   // console.log("got room and topic", data)
    //   roomRef.current = data.roomName
    //   setTopic(data.topic)
    // });

    // socketRef.current.on('winner', (winner: any) => {

    //   // if the winner (uuid) is the same as the userId(uuid)
    //   // then we will remove the interval so it no longer sends data
    //   // and the other users can appear in the array. Also make sure
    //   // that value isn't already in the array just to make sure.
    //   if (!winnerRef.current.includes(winner)) {
    //     winnerRef.current.push(winner)
    //     // console.log("We got a winner")
    //     // console.log("WINNER REF", winnerRef.current)
    //     clearInterval(intervalId.current)
    //   }
    // })

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        // don't remove the canvas or their ability to draw
        // they can keep going, but if they already won, just
        // remove the socket connection so they don't keep sending.
        // Maybe even save the image as base64 string to db so they
        // have later access the the image they drew.
      }
    };
  }, []);

  return (
    <div>
      {Array.from(userCanvases).map(([userId, currCanvas]) => (
        <span key={userId}>
          <canvas
            style={{
              border: "1px solid red",
              cursor: isErasing
                ? `url('${eraserCursor}'), auto`
                : `url('${pencilCursor}'), auto`,
              marginTop: "20%",
              marginLeft: "25%",
            }}
            ref={currCanvas.canvasRef}
            width={370}
            height={370}
          ></canvas>
        </span>
      ))}

      <button
        onClick={() => {
          setIsErasing((erasing) => !erasing);
        }}
      >
        {isErasing ? "Draw" : "Erase"}
      </button>
    </div>
  );
};

export default MultiplayerMode;
