import React from 'react';
import io from 'socket.io-client';
const port = 3000;
const url = 'http://localhost:'+port;
const socket = io(url);

function socketIsListening(){
    socket.on('button', () => console.log('server emitted to webpage socket'));
}

export class Box extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            message: null
        };
        socketIsListening();
    }
    
    onClick() {
        socket.emit('button', 'Button Activated');
    }
    
    render() {
        return (
            <button onClick={ () => this.onClick()}> Hello, User </button>
        )
    }
}

