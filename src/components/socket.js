import io from 'socket.io-client';

const port = 3000;
const url = 'http://localhost:'+port;
export const socket = io(url,{autoConnect: true});

export function socketIsListening(){
    socket.on('button', () => console.log('server emitted to webpage socket'));
    socket.on('waiting', () => console.log('you need to wait'));
    socket.on('message', message => console.log(message));
    socket.on('error', error => console.log(error));
    socket.on('update-game', (moveData) => {
        console.log(JSON.stringify(moveData))
    });
    socket.on('opponent-surrendered', () => console.log('opponent surrendered'))
}