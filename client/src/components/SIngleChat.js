import React from 'react'
import { ChatState } from '../context/ChatProvider'
import { Box, Text } from "@chakra-ui/layout";
import { IconButton, Spinner, useToast } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { FormControl } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { useEffect, useState } from "react";
import './style.css'

import { getSender, getSenderFull } from '../config/ChatLogics';
import ProfileModal from './Miscellaneous/ProfileModal';
import UpdateGroupChatModal from './Miscellaneous/UpdateGroupChatModal';
import axios from "axios";
import ScrollableChat from './ScrollableChat';


const SingleChat = ({fetchAgain, setFetchAgain}) => {

    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    // const [socketConnected, setSocketConnected] = useState(false);
    // const [typing, setTyping] = useState(false);
    // const [istyping, setIsTyping] = useState(false);

    const{ user, selectedChat, setSelectedChat } = ChatState();
    const toast = useToast();

    //send message
    const sendMessage = async (e) =>{
      if(e.key === "Enter" && newMessage){
        try {
          const config ={
            headers:{
              "Content-Type":"application/json",
              Authorization:`Bearer ${user.token}`
            }
          }
          const {data} = await axios.post("/api/message", {
            content: newMessage,
            chatId: selectedChat._id,
          }, config);

          console.log(data);
            
          
          setNewMessage("");
          //append new message to existing messages of that chat
          setMessages([...messages, data])
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
    }

    //fetch all messages
    const fetchMessages = async(e) =>{
      if(!selectedChat) return;

      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`
          } 
        }
        setLoading(true);
        //fetch
        const {data} = await axios.get(`api/message/${selectedChat._id}`, config);

        console.log(messages);
        //set messages
        setMessages(data);
        setLoading(false);

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
    }

    useEffect(()=>{
      fetchMessages();
    }, [selectedChat])

    const typingHandler= (e) => {
      setNewMessage(e.target.value);

      // Typing indicator logic
    }

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
         color="black">

          <IconButton 
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon/>}
              onClick={() => setSelectedChat("")}
          />
        
          {!selectedChat.isGroupChat ? (
            <>
              {getSender(user, selectedChat.users)}
              <ProfileModal user={getSenderFull(user, selectedChat.users)}/>
            </>
          ): (
            <>{selectedChat.chatName.toUpperCase()}
                 <UpdateGroupChatModal
                    fetchMessages={fetchMessages}
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                  />
            </>
          )} 
        </Text>

      
        <Box display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden">

                {/* Messages */}
                {loading ? (
                  <Spinner 
                  size="xl"
                  w={20}
                  h={20}
                  alignSelf="center"
                  margin="auto"/>
                ):(
                  <div className='messages'>
                    <ScrollableChat messages={messages}/>
                  </div>
                )
              }

              <FormControl onKeyDown={sendMessage} isRequired mt={3}>
                <Input
                  variant="filled"
                  bg="#E0E0E0"
                  placeholder="Enter a message.."
                  value={newMessage}
                  onChange={typingHandler}
                />
              </FormControl>
        </Box>
        </>
      ) : (
        // No chat selected 
        <Box display="flex" alignItems="center" justifyContent="center" h="100%">
          <Text fontSize="3xl" pb={2} fontFamily="Work sans" color="black">
            Select a user to start chatting
          </Text>
        </Box>
      )}
  </>
  );
};

export default SingleChat;
