# Socket.io, Express and React

In another project, I wanted to build a react application on an express server that utilized socket.io to allow users to interact in realtime. Here, I wanted to strip away all of the unnecessary parts and build a working prototype with those features.

## Important Notes

* You must install a socket on the frontend and the backend of the web app. (The socket on the backend is sometimes called "socker" as an abreviation of "socket server")
* The (backend) socker is brought online by:

```js
const socket = require('socket.io');
const io = socket(server);
```

* You must write your own "protocol" for the (frontend) client sockets and the (backend) socker to communicate.

* The backend "protocol" is setup with something like:

```js
io.on('connection', (socket) =>{
    console.log('browser communicated with server');
    socket.on('button', data => {
        console.log(data);
        io.sockets.emit('button');
    });
    socket.on('client-event', () => {
        //do something on the backend
        const data = "data to be returned to frontend";
        io.sockets.emit('client-event-has-been-handled-by-backend', data)
    })
})
```

* The client socket can be stored in a different file separate from the react components and imported into relevant components. We use a function like the following to handle the client-side protocol:

```js
export function socketIsListening(){
    socket.on('button', () => console.log('server emitted to client socket'));
    socket.on('backend-event', () => {/*do something else*/})
    socket.on('client-event-has-been-handled-by-backend', () => {
        this.setState({
            //updates state
        });
    });
}
```

* Since we want the client socket to be able to update the state of our react components directly, we include the following in the component class constructor.

```js
    class Component extends React.Component{
        super(props);
        this.state = {
            // ...
        }
        socketIsListening.bind(this)();
        /*
            ...
            //more react stuff
            ...
        */
    }
```