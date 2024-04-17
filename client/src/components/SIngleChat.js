import React from "react";
import { ChatState } from "../context/ChatProvider";
import { Box, Text } from "@chakra-ui/layout";
import {
  IconButton,
  Spinner,
  useToast,
  Image,
  Button,
  Flex,
} from "@chakra-ui/react";
import { ArrowBackIcon, PlusSquareIcon } from "@chakra-ui/icons";
import { FormControl } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { useEffect, useState } from "react";
import "./style.css";

import { getSender, getSenderFull } from "../config/ChatLogics";
import ProfileModal from "./Miscellaneous/ProfileModal";
import UpdateGroupChatModal from "./Miscellaneous/UpdateGroupChatModal";
import axios from "axios";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";

import MemeGeneration from "./MemeGeneration";

const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showMemeGeneration, setShowMemeGeneration] = useState(false);

  const { user, selectedChat, setSelectedChat } = ChatState();
  const toast = useToast();
  const newDate = () => {
    return new Date();
  };
  const [memeUrl, setMemeUrl] = useState(null);
  // Function to handle receiving meme URL from MemeGeneration component

  const handleToggleMemeGeneration = () => {
    setShowMemeGeneration(!showMemeGeneration);
  };
  const handleReceiveMemeUrl = (url) => {
    setMemeUrl(url);
  };

  //send message
  const sendMessage = async () => {
    if (newMessage) {
      // if(newMessage && memeUrl!==null)
      //stop typing indicator
      socket.emit("stop typing", selectedChat._id);

      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        let requestData = {
          content: newMessage,
          chatId: selectedChat._id,
          messageType: "text",
        };

        console.log(requestData);
        // console.log(memeUrl);
        //send the message
        const { data } = await axios.post("/api/message", requestData, config);
        // content: newMessage,
        // chatId: selectedChat._id,

        console.log(data);

        socket.emit("new message", data);
        // setNewMessage("");
        //append new message to existing messages of that chat
        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  //receive message from socket server
  //wont run just one time, update every time state updates
  // useEffect(()=>{
  //   socket.on('message received', (newMessageRecieved) => {
  //     //if none of the chat is selected or doesnt match the current selected chat
  //     if(!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id) {
  //        //give notification
  //     }
  //     else {
  //       //add to list of messages
  //       setMessages([...messages, newMessageRecieved]);
  //     }

  //   })
  // })

  //start socket.io
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  //wont run just one time, update every time state updates
  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      //if none of the chat is selected or doesnt match the current selected chat
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        //give notification
      } else {
        //add to list of messages
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });
  //fetch all messages
  const fetchMessages = async (e) => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      setLoading(true);
      //fetch
      const { data } = await axios.get(
        `api/message/${selectedChat._id}`,
        config
      );

      console.log(messages);
      //set messages
      setMessages(data);
      setLoading(false);

      //join the room
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Message",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  useEffect(() => {
    fetchMessages();

    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  //typing indicator
  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    // socket connection
    if (!socketConnected) return;

    //set typing
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    //stop typing indicator after 3s of no typing
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = newDate().getTime();
      var timeDiff = timeNow - lastTypingTime;

      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  const handleSendMeme = async (memeUrl) => {
    if (memeUrl) {
      try {
          // Convert meme image to base64 string
      // const base64Image = await getBase64Image(memeUrl);
        // Fetch the image from the URL
      const response = await fetch(memeUrl);
      const blob = await response.blob();

      // console.log(blob);
      // Convert the image blob to base64-encoded data
      const base64Image = await convertBlobToBase64(blob);
   
    
  
        const requestData = {
          content: base64Image, // Set content as empty since it's a meme
          chatId: selectedChat._id,
          messageType: "meme",
          
        };

          // console.log(base64Image);
          const config = {
            headers: {
              // "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          };
  
        // Send the meme URL to the server
        const { data } = await axios.post("/api/message", requestData, config);
        // Emit the new message event to socket
        socket.emit("new message", data);
        // Add the meme message to the messages state
        console.log(memeUrl);

        setMessages([...messages, data]);
      } catch (error) {
        console.log(error);
        toast({
          title: "Error Occurred!",
          description: "Failed to send the meme",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  // Function to convert blob to base64-encoded data
const convertBlobToBase64 = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result.split(",")[1]); // Return base64 string without data URL prefix
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsDataURL(blob);
  });
};


  console.log(memeUrl);
 
  return (
    <>
      {selectedChat ? (
        <>
          {/* Name of chat */}
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
            color="black"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />

            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchMessages={fetchMessages}
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                />
              </>
            )}
          </Text>

          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="black"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {/* Messages/Memes*/}
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <>
                <div className="messages">
                  <ScrollableChat messages={messages} memeUrl={memeUrl}/>
                </div>
              </>
            )}
            <Flex alignItems="center">
              <FormControl isRequired mt={3}>
                {isTyping ? <div> Loading...</div> : <></>}
                <Input
                  variant="filled"
                  bg="#E0E0E0"
                  placeholder="Enter a message.."
                  value={newMessage}
                  onChange={typingHandler}
                />
              </FormControl>

               {/*icon to open meme picker */}
              <PlusSquareIcon
                onClick={handleToggleMemeGeneration}
                className="smiley"
                fontSize="2xl"
                cursor="pointer"
                color="grey"
              />
              {/* Send Text Message button */}
              <Button colorScheme="blue" onClick={sendMessage} ml={2}>
                Send
              </Button>
            </Flex>
            

            {showMemeGeneration && (
            <MemeGeneration
              handleReceiveMemeUrl={handleReceiveMemeUrl}
              handleSendMeme={handleSendMeme}
            />
            )}
          </Box>
        </>
      ) : (
        // No chat selected
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize="3xl" pb={2} fontFamily="Work sans" color="black">
            Select a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;