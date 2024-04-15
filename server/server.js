const express = require('express');
// const {chats} = require("./data/data");
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const cors = require('cors');

const app = express();
dotenv.config();
connectDB();
//accept JSON data
app.use(express.json());

app.use(cors());

// app.get( '/', (req, res) => {
//     res.send("Hello World");
// })

// app.get('/api/chat', (req,res)=>{
//     res.send(chats);
//     console.log(res);
// })

// app.get('/api/chats/:id',(req,res)=>{
//     // console.log(req);
//     // console.log(req.params.id);
//     const singleChat = chats.find((c) => c._id === req.params._id);
//     res.send(singleChat);
// })

app.use('/api/user', userRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/message', messageRoutes)


const PORT = process.env.PORT || 5000;
const server = app.listen(5000,()=>{
    // connect();
    console.log(`Server started on port ${PORT}`)
});

const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors:{
        origin: "http://localhost:3000",
    }
})
//create connection
io.on("connection", (socket)=>{
    console.log('connected to socket.io');

    //will take user data from client end
    socket.on('setup', (userData)=>{
        //exclusive room for user
        socket.join(userData._id);
        // console.log(userData._id);
        socket.emit('connected');
    })

    //room id from client
    socket.on('join chat', (room)=>{
        socket.join(room);
        console.log('user joined room:' + room)
    });

    //socket for typing
    socket.on('typing', (room) => socket.in(room).emit("typing"));

    socket.on('stop typing', (room) => socket.in(room).emit("stop typing"));
    

    socket.on('new message', (newMessageRecieved) => {
        //check chat
        var chat = newMessageRecieved.chat;

        //if chat does not have any users
        if(!chat.users) return console.log("chat, users not defined")

         chat.users.forEach(user=> {
            //if msg by sender; dont send the msg back
            if(user._id == newMessageRecieved.sender._id) return;

            //else sent to rest of users
            socket.in(user._id).emit("message recieved", newMessageRecieved);
         })
        
    })

    //close connection
    socket.off("setup", () =>{
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
    })
})



