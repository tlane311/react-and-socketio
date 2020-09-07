import React from 'react';
import io from 'socket.io-client';
const port = 3000;
const url = 'http://localhost:'+port;
const socket = io(url);

function socketIsListening(){
    socket.on('button', () => console.log('server emitted to webpage socket'));
    socket.on('waiting', () => console.log('you need to wait'));
    socket.on('message', message => console.log(message));
    socket.on('error', error => console.log(error));
    socket.on('update-game', (moveData) => {
        console.log(JSON.stringify(moveData))
    });
    socket.on('opponent-surrendered', () => console.log('opponent surrendered'))
}

export class Box extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            message: null,
            playerIsQueued: false,
            gameState: []
        };
        socketIsListening();
    }
    
    async queueClick() {
        if (!this.state.playerIsQueued){
            await socket.emit('queue', socket.id);
            await this.setState({
                playerIsQueued: true,
            });
        } else {
            console.log(`you've already queued`);
        }
    }

    async moveClick(){
        const gameState = this.state.gameState.slice();
        const numberOfMoves = gameState.length;
        const moveData = numberOfMoves > 0
        ? `${numberOfMoves+1} moves have been performed`
        : `a move has been performed`
        await socket.emit('move', moveData);
        const nextState = gameState.concat(moveData);
        await this.setState({
            gameState: nextState
        })
    }

    async surrenderClick() {
        await socket.emit('surrender');
    }

    createListElement(data){
        return(
            <li>{data}</li>
        )
    }
    
    render() {
        const gameState = this.state.gameState;
        return (
            <div>
                <button onClick={ () => this.queueClick()}> Queue Button </button>
                <button onClick={ async () => {await this.moveClick()} }> Move Button</button>
                <ol>
                    {gameState.map(move => this.createListElement(move))}
                </ol>
                <button onClick={ () => this.surrenderClick()}> Forfeit button </button>
                <button onClick= { () => socket.close() }>  Disconnect From Server </button>
                <button onClick= { () => socket.connect(url) }>  Connect To Server </button>
            </div>
        )
    }
}

