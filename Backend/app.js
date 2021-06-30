const path = require('path');
const fs = require('fs');
const multer = require('multer');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');



const bodyParser = require ('body-parser');
const cors = require('cors');

const app = express();
const server = http.Server(app);
const io = socketio(server);

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

const Messagedata = require('./src/model/Messagedata');
//file upload

const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, 'uploads')
    },
    filename: (req, file, callBack) => {
        var date=new Date().toDateString();
        callBack(null, `${date}_${file.originalname}`)
    }
  })

  const upload = multer({ storage: storage })
  
//variables
let clientSocketIds = [];
let connectedUsers= [];
let rooms=[];
//SOCKETS

io.on('connection', socket => {
    var user = socket.handshake.query.username ;
    console.log('A new user connected..',user);

    socket.on('disconnect', () => {
        console.log("A user disconnected..",user)
        connectedUsers = connectedUsers.filter(item => item.socketId != socket.id);
        io.emit('updateUserList', connectedUsers)
    });

    socket.on('loggedin', function(user) {
        clientSocketIds.push({socket: socket, userId:  user});
        // connectedUsers = connectedUsers.filter(item => item.user_id != user.user_id);
        connectedUsers.push({user, socketId: socket.id})
        console.log('Connected users-',connectedUsers);
        console.log('Connected sockets-',clientSocketIds);
        io.emit('updateUserList', connectedUsers)
    });
 
    socket.on('createRoom', function(data) {
        if(rooms.includes(data.room)){
            socket.join(data.room);
        }
        else if(rooms.includes(data.roomalt)){
            socket.join(data.roomalt);
        }
        else{
            rooms.push(data.room);
            socket.join(data.room);
        }        
        io.emit('response',{mes:"Room Created successfully!"})
        let withSocket = getSocketByUserId(data.withUser.user);
        socket.broadcast.to(withSocket.id).emit("invite",{room:data})
    });

    socket.on('joinRoom', function(data) {
        if(rooms.includes(data.room)){
            socket.join(data.room);
        }
        else if(rooms.includes(data.roomalt)){
            socket.join(data.roomalt);
        }
    });

    socket.on('sendMessage', function(data) {
        roomopts=data.room.split('.');
        console.log('rooms',roomopts);
        console.log('Data-',data);
        if(rooms.includes(roomopts[0])){
            var msg = {
                to:data.to,
                from:data.from,
                message:data.message,
                image:data.image,
                date:new Date(),
                room:roomopts[0],
                isForwarded:data.isForwarded
            }
            var msg=Messagedata(msg);
            msg.save();
            
            io.sockets.in(roomopts[0]).emit('newMessage', data);
        }
        // else if(rooms.includes(roomopts[1])){
            else{
            var msg = {
                to:data.to,
                from:data.from,
                message:data.message,
                image:data.image,
                //date:new Date(),
                room:roomopts[1],
                isForwarded:data.isForwarded
            }
            var msg=Messagedata(msg);
            msg.save();
            console.log('Saving Message')
            
            io.sockets.in(roomopts[1]).emit('newMessage', data);
        }
        
       
    })
});
//functions

const getSocketByUserId = (userId) =>{
    let socket = '';
    for(let i = 0; i<clientSocketIds.length; i++) {
        if(clientSocketIds[i].userId == userId) {
            socket = clientSocketIds[i].socket;
            break;
        }
    }
    return socket;
}

//Routings
const authRouter = require('./src/routes/AuthRouter') ();
const msgRouter = require('./src/routes/MessageRouter')();

app.use('/user',authRouter);
app.use('/msg',msgRouter); 

app.get('/', function (req,res){
    res.send('Hello from server');
})

app.post('/file', upload.single('file'), (req, res, next) => {
    const file = req.file;
    console.log('Uploading file..',file.filename);
    if (!file) {
      const error = new Error('No File')
      error.httpStatusCode = 400
      return next(error)
    }
      res.send(file);
  })


const PORT = 3000 || process.env.PORT;

server.listen(PORT,() => console.log(`Server running on port ${PORT}`));

