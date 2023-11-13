import { Socket } from "socket.io-client";

// this class will encapsulate user
// canvas data and allow us to easily
// encode, decode, and re-draw canvases
// that are sent over websockets.
class UserCanvas {
    public canvasRef: React.RefObject<HTMLCanvasElement>;
    public userId: string 
    constructor(canvasRef: React.RefObject<HTMLCanvasElement>, userId: string) {
        this.canvasRef = canvasRef; 
        this.userId = userId 
    }

    // methods:
    // get context to be able to draw on the canvas.
    public getCtx() {
        return this.canvasRef.current?.getContext('2d');
    }

    // encode canvas data
    public encodetoBase64() {
        // if the canvasRef exists, encode
        return this.canvasRef.current?.toDataURL();
    }
   
    // send canvas data
    public sendCanvasData(socket: Socket) {
        const base64Data = this.encodetoBase64();
        socket.emit('canvasData', { userId: this.userId, data: base64Data });
    }

    // update canvas from received base64 data
    public updateCanvasFromData(base64Data: string) {
        const ctx = this.getCtx();
        // if context exits, draw the image onto the canvas
        if (ctx) {
            let img = new Image();
            img.onload = () => {
                ctx.drawImage(img, 0, 0);
            };
            img.src = base64Data;
    } 
    }
}

export default UserCanvas;

