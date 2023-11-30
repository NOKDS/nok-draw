module.exports = class RoomUser {
  constructor(socket, canvasString="") {
    this.canvasString = canvasString;
    this.socket = socket;
    this.userId = this.socket.userId
  }

  setCanvasString(canvasString) {
    this.canvasString = canvasString;
  }

  getCanvasString() {
    return this.canvasString;
  }

  getUserId() {
    return this.socket.userId;
  }

}