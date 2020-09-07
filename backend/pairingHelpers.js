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
        playerOne: true,
        playerTwo: true
    }
    gameList.push(individualGameData);
    console.log(`A game with Room ID: ${playerOne} has been added to the gameList`);
}

/*
    socket.on('move', async (moveData) => {
        const roomName = findPlayerRoom(socket)
        if (!roomName) io.to(socket.id).emit('error', 'you are not in a room') return null;
        
    });
*/


function findPlayerRoom(socket){
    const roomIndex = gameList.indexOf( gameData => gameData.playerOne===socket.id || gameData.playerTwo===socket.id);
    if (roomIndex < 0) return null;
    return gameList[roomIndex].room;    
}

