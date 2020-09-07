const express=require('express');
const app = express();
const port = 3000;
const server = app.listen(port, () => console.log(`Server is up and running on port ${port}`) );


app.use(express.static('../build'));
//app.use(express.static('../public'));


const socket = require('socket.io'); //socket is the socket.io module
const io = socket(server); //io is the server socket


let queue = [];
let gameList=[];
const gameStartData={
    list:[]
}
async function pairTwoPlayers(socket){
    const playerOne=queue.shift();
    const playerTwo=queue.shift(); //removes playerTwo
    console.log('more than one player has queued; now pairing players');
    await socket.join(playerOne);
    await io.to(playerOne).emit('message','two players are in the room');
    console.log(`Player ${playerTwo} has joined Player ${playerOne}'s room`);
    const individualGameData = {
        room: playerOne,
        game: JSON.parse(JSON.stringify(gameStartData)),
        playerOne: playerOne,
        playerTwo: playerTwo
    }
    gameList.push(individualGameData);
    console.log(`A game with Room ID: ${playerOne} has been added to the gameList`);
}


function findPlayerRoom(socket){
    const socketId = socket.id;
    const roomIndex = gameList.findIndex( gameData => gameData.playerOne===socketId || gameData.playerTwo===socketId);

    return roomIndex < 0
    ? null
    : gameList[roomIndex].room;
}

function updateGameOnServer(roomName,moveData){
    const roomIndex = gameList.findIndex(gameData => gameData.room===roomName);
    gameList[roomIndex].game.list.push(moveData);
    return null;
}


io.on('connection', (socket) =>{
    socket.on('queue', player => {
        queue.push(player);
        queue.length > 1
        ? (
            pairTwoPlayers(socket)
        )
        : io.sockets.emit('waiting');
    });
    socket.on('move', async (moveData) => {
        const roomName = findPlayerRoom(socket);
        console.log("In 'move' callback, the roomName is: ", roomName);
        if (!roomName) {
            io.to(socket.id).emit('error', 'you are not in a room');
            return null;
        }
        updateGameOnServer(roomName,moveData);
        await io.to(roomName).emit('update-game', moveData);
    });

    socket.on('surrender', () => {
        const roomName = findPlayerRoom(socket);
        const roomIndex=gameList.findIndex(gameData => gameData.room === roomName)
        io.to(roomName).emit('opponent-surrendered')
        gameList.splice(roomIndex,1)
    })
})

