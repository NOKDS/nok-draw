module.exports = function setupSocketServer(io) {
    let queue = [];
    let roomCount = 0;
    const topics = ['house', 'cat', 'fish', 'camera', 'teddy-bear', 'bicycle', 'sun', 'hat', 'tree', 'lion', 'telephone', 'hand', 'leaf', 'star', 'baseball', 'car', 'snowman', 'guitar', 'moustache']
    io.on('connection', (socket) => {

        socket.on('joinGame', (userId) => {
            console.log("User with ID:", userId, "wants to join a game!");

            // Attach the userId to the socket for future reference
            socket.userId = userId;

            queue.push(socket);

            const allUsers = queue.map((player) => player.userId);
            // emit all userIds, and then users will update
            // accordingly on their end.
            for (let sock of queue)
                sock.emit('users', allUsers);

            // Check if the queue has enough players for a new room
            if(queue.length === 3) {
                roomCount++;
                const roomName = 'room-' + roomCount;
                console.log('NEW ROOM', roomName, queue)
                for(let player of queue) {
                    player.join(roomName);
                    player.emit('assignedRoom', {roomName});
                }

                // Reset the queue for next set of players
                queue = [];
            }
        });

            socket.on('canvasData', async (data) => {
            // emit base64 data from the user to all others in the room 
            socket.to(data.roomName).emit('serverDraw', data);
            console.log('canvasData: sent it to other users')

        });

        socket.on('disconnect', () => {
            // console.log("Client disconnected:", socket.userId);
            queue = queue.filter((player) => player.userId !== socket.userId);
        });


    
    });
}
