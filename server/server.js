const express = require('express');
// const {chats} = require("./data/data");
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');

const app = express();
dotenv.config();
connectDB();
//accept JSON data
app.use(express.json());

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


const PORT = process.env.PORT || 5000;
app.listen(5000,()=>{
    // connect();
    console.log(`Server started on port ${PORT}`)
});

