const axios = require('axios');
const RoomUser = require('./RoomUserClass');
const User = require('./db/models/user');
const { Game } = require('./db/models');

const baseUrl = process.env.FLASK_APP_API_URL || 'http://127.0.0.1:5000';

module.exports = function setupSocketServer(io) {
    let queue = [];
    let roomCount = 0;
    let rooms = {};
    let roomUsers = {}
    const topics = categories = [
              "bear", "bird", "cat", "cow", "dog", "elephant",
              "horse", "lion", "penguin", "rabbit", "airplane",
              "computer", "crocodile", "clock", "compass", "camel",
              "fireplace", "campfire", "diamond",
              "triangle", "snake", "beach", "camera", "sandwhich",
              "chair", "arm", "bed", "baseball", "snowman"
              ]
    io.on('connection', (socket) => {

        socket.on('joinGame', (data) => {
            const userId = data.userId
            // console.log("User with ID:", userId, "wants to join a game!");

            // Attach the userId to the socket for future reference
            socket.userId = userId;

            // if user has email (logged in) send data through socket later.
            if (data.email) {
                socket.email = data.email;
            }

            queue.push(socket);

            // const allUsers = queue.map((player) => player.userId);
            const allUsers = queue.filter(player => player.connected).map(player => player.userId);

            // emit all userIds, and then users will update
            // accordingly on their end.
            for (let sock of queue)
                sock.emit('users', allUsers);

            // Check if the queue has enough players for a new room
            if(queue.length === 4) {
                roomCount++;
                const roomName = 'room-' + roomCount;

                // we have the rooms which holds the room names as
                // key and holds the value as an array of the sockets
                // in that room.

                // roomUsers are the objects which hold the socket and
                // the base64 string. the base64 string will be updated
                // every time we receive a canvas update from a user.
                const currentRoomUsers = {};
                queue.forEach(socket => {
                    currentRoomUsers[socket.userId] = new RoomUser(socket);
                });

                roomUsers[roomName] = {...currentRoomUsers} 
                
                rooms[roomName] = [...queue] 

                // console.log(rooms)
            
                // console.log('NEW ROOM', roomName, queue)
                const topic = topics[Math.floor(Math.random() * topics.length)];
                const timestamp = Date.now()
                for(let player of queue) {
                    player.join(roomName);
                    player.roomName = roomName; 
                    Math.floor(Math.random() * topics);
                    const timestamp = Date.now();

                    
                    player.emit('assignedRoom', {roomName, topic, timestamp});
                }

                // send an object with all of them to the backend.
                setTimeout(async ()=> {
                    // console.log("TIMEOUT")
                    
                    if (roomUsers && roomName in roomUsers){
                        const canvasStrings = Object.values(roomUsers[roomName]).map(value => Object.fromEntries([['userId',value.userId], ['canvasString', value.canvasString]]));
                        // console.log("CANVAS STRINGS", canvasStrings)
                        try {
                            const response = await axios.post(`${baseUrl}/predictMany`, {
                                canvasStrings: canvasStrings
                            });
                            // console.log("GOT RESULT", response)
                            // object containing the userIds mapped to the guesses
                            const userGuesses = response.data.message.guesses 
                            console.log("Response", userGuesses)
                            const winners = []
                            const falseProbability = [0.18275894224643707, 0.08449413627386093, 0.08340463787317276, 0.0820060670375824];
                            for (let id in userGuesses) {
                                // for each key value pair (id to 2d array)
                                // see if topic exists in there and then
                                // put the [id, probabiliy] array in winners array.
                                // it will be sorted and winners determined from there.
                                for (let i = 0; i < userGuesses[id].length; i++){
                                    const array = userGuesses[id][i]
                                    if (array[0] == topic && !falseProbability.includes(array[1])) {
                                        winners.push([id, array[1]])
                                    }
                                }
                                // if the topic is not found in the prediction, put a probability of 0.
                                if (winners.length && winners[winners.length-1][0] != id) {
                                    winners.push([id, 0])
                                }
                                else if (!winners.length) {
                                    winners.push([id, 0])
                                }
                            }
                            console.log(winners)
                            winners.sort((a, b) => {
                                return b[1] - a[1];
                            });

                            console.log("WINNERS SORTED", winners)

                            userStats = {}
                            let places = ['1st', '2nd', '3rd', '4th']
                            for (let i = 0; i < winners.length; i++) {
                                // if probability is not 0, place is i + 1, else place is LOSS 
                                const place = winners[i][1] ? i + 1 : 0 
                                userStats[winners[i][0]] = {place: place, top4Guesses: userGuesses[winners[i][0]].map(value => value[0])}
                            }

                            console.log("USER STATS", userStats)
                            console.log("QUEUE", rooms[roomName])
                            for(const socket of rooms[roomName]) {
                                socket.emit('winners', userStats)
                                console.log('sent message winners')
                                
                                if (socket.email) {
                                    try {
                                        const user = await User.findOne({
                                            where: {
                                                email: socket.email
                                            }
                                        });
                                        await Game.create({
                                            isWon: userStats[socket.userId].place,
                                            category: topic,
                                            top3Predications: JSON.stringify(userStats[socket.userId].top4Guesses),
                                            image: roomUsers[roomName][socket.userId].getCanvasString(),
                                            UserId: user.id,
                                        });
                                        // console.log("FOUND USER", user)
                                } catch (e) {
                                    console.log(e)
                                }
                                }
                            }

                        } catch (e) {
                            console.log("The error happened", e)
                        }
                    }
                }, (15000))

                // Reset the queue for next set of players
                queue = [];
            }
        });

        socket.on('canvasData', async (data) => {
            // emit base64 data from the user to all others in the room 
            socket.to(data.roomName).emit('serverDraw', data);

            // update the user's canvas snapshot in the RoomUser object.
            if (roomUsers && data.roomName in roomUsers && data.userId in roomUsers[data.roomName]){ 
                roomUsers[data.roomName][data.userId].setCanvasString(data.base64Img);
                // // console.log('updated snapshot for', data.userId)
            }

        });

        // socket.on('predict', async (data) => {

        //     // send an object with all of them to the backend.
        //     if (roomUsers && data.roomName in roomUsers){ 
        //         const canvasStrings = Object.values(roomUsers[data.roomName]).map(value => value.canvasString);
        //         try {
        //             const response = await axios.post('http://127.0.0.1:5000/predictMany', {
        //                 canvasStrings: canvasStrings
        //             });
        //         } catch (e) {
        //             // console.log("The error is", e)
        //         }

        //     }

        // });


        socket.on('disconnect', () => {
            // // console.log("Client disconnected:", socket.userId);
            queue = queue.filter((player) => player.userId !== socket.userId);

            // if the game has already started
            // console.log('removed')
             let roomName = socket.roomName;
             // console.log('roomname is', roomName)
             if (roomName && rooms[roomName]) {
                let socketIndex = rooms[roomName].indexOf(socket);
                if (socketIndex !== -1) {
                    // console.log('works')
                    rooms[roomName].splice(socketIndex, 1);
                    // console.log(rooms[roomName].length)
                    if (rooms[roomName].length === 0) {
                        delete rooms[roomName];
                    }
                    else {
                        // broadcast updated user ids to others in room.
                        const allUsers = rooms[roomName].filter(player => player.connected).map(player => player.userId);
                        // console.log('all users', allUsers)
                        for (let sock of rooms[roomName])
                            sock.emit('users', allUsers);
                        // console.log("UPDATED ALL")
                    }
                }
            }
            // console.log(roomUsers)
            if (roomUsers && roomUsers[roomName]) {
                // in each roomUser object, there is
                // a bunch of userId to roomUserClass pairs
                if (socket.userId in roomUsers[roomName]) {
                    // console.log('deleted the user')
                    delete roomUsers[roomName][socket.userId]
                }
                // if the room in roomUsers is empty then remove it
                if (!Object.keys(roomUsers[roomName]).length) {
                    delete roomUsers[roomName]
                    // console.log('deleted room')
                }
            }


        });


    
    });
}
