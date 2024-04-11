const  {createError}  = require ("../utils/error.js");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");
const generateToken  = require('../config/generateToken');

const bcrypt = require('bcryptjs');

//create/access chats
const accessChat = async (req,res,next) =>{
    //take user id with which chat is to be created/current user
    const { userId } = req.body;
    //if chat with userId exists, return it else create one
    if(!userId){
        return next(createError(400,"UserId params not sent with request"));
    }
    //if chat exists w userId 
    var isChat = await Chat.find({
        isGroupChat: false,
        $and:[
            //eq to curr user logged in, user id sent
            {users: {$elemMatch:{$eq:req.user._id}}},
            {users: {$elemMatch:{$eq:userId}}},
        ],
        //if chat found, populate users array except password
    }).populate("users", "-password").populate("latestMessage");//populate w all user information

    isChat = await User.populate(isChat,{
        path:'latestMessage.sender',
        select: "name profilePic email",
    });

    //if chat exists, send chat
    if(isChat.length>0){
        res.send(isChat[0]);
    }
    else{
        //create a new chat
        var chatData = {
            chatName: "sender",
            isGroupChat: false,
            //curr user and userId with which chat is to be created
            users: [req.user._id, userId],
        };
        //query and store in database
    try {
        const createdChat = await Chat.create(chatData);

        const fullChat = await Chat.findOne({_id: createdChat._id}).populate("users", "-password");

        res.status(200).json(fullChat);

    }catch(err){
        console.log(err);
    }
 }
}


//fetch chats

const fetchChats = async(req,res,next) => {
    //check which user logged in, and query all of the chats
    try { //in chatModel's users
        Chat.find({users: { $elemMatch: {$eq: req.user._id} } })
        // .then(result => res.send(result))
        .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({updatedAt: -1}) //from new to old
      .then(async (results)=>{
        results = await User.populate(results, {
            path: "latestMessage.sender",
            select: "name pic email",
          });
          res.status(200).send(results);
      })
    } catch (error) {
        res.status(400).send(error);
    }
}

//create group chat
const createGroupChat = async(req,res)=>{
    //take bunch of users from body, and name of the groupchat
    if (!req.body.users || !req.body.name) {
        return res.status(400).send({ message: "Please Fill all the feilds" });
      }
      //get all users from body
      var users= JSON.parse(req.body.users);

      //check group members count
    if (users.length < 2) {
        return res
          .status(400)
          .send("More than 2 users are required to form a group chat");
      }

       //add logged in user along with added users
       users.push(req.user);

       //create request to query the database
    try 
    {  //create grpup chat
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user, //logged in user
        });
        //fetch groupchat from db and send to user
        const fullGroupChat = await Chat.findOne({ _id: groupChat._id }) //id of created group chat
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

        res.status(200).json(fullGroupChat);

    } catch (error) {
        res.status(400).send(error.message);
     }   
}

//rename group
const renameGroup = async(req,res,next) =>{
    //chatid and name to rename
    const{chatId, chatName} = req.body;

    const updatedChat = await Chat.findByIdAndUpdate
    (
        //find 
        chatId,
        {   //updation
            chatName //chatName:chatName
        }, {
            new: true, //to return updated value
        }
    ).populate("users", "-password")
     .populate("groupAdmin", "-password");

    if (!updatedChat) {
            // res.status(404).send("Chat Not Found");
            return next(createError(400,"Chat not found"))
     }else{
        res.json(updatedChat);
    }
} 


const addToGroup = async(req,res,next) =>{
    //take chatId and new user to add
    const{chatId, userId} = req.body;

    const added = await Chat.findByIdAndUpdate(
        chatId,{
            //update users array; push
            $push: { users: userId},
        },
        {
            new: true
        }
    ).populate("users", "-password")
    .populate("groupAdmin", "-password");

    if (!added) {
        return next(createError(400,"Chat not found"));
      } else {
        res.json(added);
      }
}

const removeFromGroup = async(req,res,next) =>{
    //takes chatId and userId to remove
    const{chatId, userId} = req.body;

    const removed = await Chat.findByIdAndUpdate(
        chatId,
        {
            $pull: {users: userId},
        },
        {
            new: true
        }
    ).populate("users", "-password")
    .populate("groupAdmin", "-password");

    if(!removed){
        return next(createError(400,"Chat not found"));
    }else{
        res.json(removed);
    }
}

module.exports = {accessChat, fetchChats, createGroupChat, renameGroup, addToGroup, removeFromGroup};


// The code you provided is a accessChat function that's used to access a chat in a chat application. Here's a breakdown of what the code does:

// The accessChat function takes three parameters: req, res, and next. The req parameter is the request object, the res parameter is the response object, and the next parameter is a callback function that's called when the accessChat function is finished.
// The accessChat function checks if the userId parameter is present in the request body. If it's not present, the function returns a 400 status code and a message indicating that the userId parameter is required.
// The accessChat function checks if a chat with the userId parameter already exists. If it does, the function returns the chat object.
// If a chat with the userId parameter doesn't exist, the accessChat function creates a new chat with the userId parameter and the current user's ID.
// The accessChat function populates the chat object with the user information, including the user's name, profile picture, and email.
// The accessChat function sends the chat object as the response.