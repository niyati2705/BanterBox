const  {createError}  = require ("../utils/error");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");

//send a new message

const sendMessage = async (req,res)=>{
    //chatId, message, sender
    const {chatId, content} = req.body;

    if(!content || !chatId) {
        console.log("Invalid data passed into request");
        return res.sendStatus(400);
    }

    //create a new messgage
    var newMessage = {
        sender: req.user._id, 
        content: content,
        chat: chatId,
    };
    
    try {
        var message = await Message.create(newMessage);
        //populating instance of mongoose class
        message = await message.populate("sender", "name pic");
            message = await message.populate("chat");
            message = await User.populate(message, {
                path: "chat.users",
                select: "name pic email",
            });

            await Chat.findByIdAndUpdate(req.body.chatId, {
                latestMessage: message,
            });

        res.json(message);

    } catch (error) {
        res.status(400);
        console.log(error);
    }
};

//fetch all messages

const allMessages = async(req,res) => {
    try {
        const messages= await Message.find({
            chat: req.params.chatId
        }).populate("sender", "name pic email"
            ).populate("chat")

        res.json(messages);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
}

module.exports = {sendMessage, allMessages};