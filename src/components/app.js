import React from 'react';
import { socketIsListening, socket } from './socket.js';

export class Box extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            message: null,
            playerIsQueued: false,
            gameState: []
        };
        socketIsListening.bind(this)();
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
        socket.emit('move', moveData);
        const nextState = gameState.concat(moveData);
        this.setState({
            gameState: nextState
        })
    }

    async surrenderClick() {
        socket.emit('surrender');
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

