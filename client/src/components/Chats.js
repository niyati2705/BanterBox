import React from 'react'
import { Box, Stack, Text} from '@chakra-ui/layout';
import { Button } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";

import { ChatState } from '../context/ChatProvider';
import ChatLoading from "./ChatLoading";

import { useEffect, useState } from 'react';
import { useToast } from "@chakra-ui/toast";
import axios from 'axios';
import { getSender } from '../config/ChatLogics';
import GroupChatModal from './Miscellaneous/GroupChatModal';


//fetch all chats for user using api
const Chats = ({fetchAgain}) => {

  //local state
  const [loggedUser, setLoggedUser] = useState();
  //import all of the states from context
  const{selectedChat, setSelectedChat, user, chats, setChats} = ChatState();

  
  const toast = useToast();

  const fetchChats = async () => {
    // console.log(user._id);
    try {
      const config = {
        headers: {
        
          Authorization: `Bearer ${user.token}`,
        },
      };

      //axios request to api
      const { data } = await axios.get("/api/chat", config);
      console.log(data); //list of chats
      setChats(data);

    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, 
  [fetchAgain]
);

    return ( 
   <Box  display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
   flexDir="column"
   alignItems="center"
   p={3}
   bg="black"
   w={{ base: "100%", md: "31%" }}
   borderRadius="lg"
   borderWidth="1px">
      {/* header */}
      <Box  pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center">

       <Text color="white">My Chats</Text>

      <GroupChatModal>
      {/* new group chat */}
        <Button  d="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon/>}>
              New Group Chat
        </Button>
       </GroupChatModal>
      </Box>

       {/* render all the chats */}
       <Box  display="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
      
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden">

          {chats ? (
            <Stack overflowY='scroll'>
                {chats.map((chat)=>(
                  <Box onClick={() => setSelectedChat(chat)}
                  cursor="pointer"
                  bg={selectedChat === chat ?  "grey":"darkgrey"
                }
                  color={selectedChat === chat ? "white" : "black"}
                  px={3}
                  py={2}
                  borderRadius="lg"
                  key={chat._id}>

                  <Text>
                    {/* sender name on the chat list if single */}
                
                    {!chat.isGroupChat
                    ? getSender(user, chat.users)
                    : chat.chatName}
                  </Text>
                  </Box>
                ))}
            </Stack>
          ) :(
            <ChatLoading/>
            // <></>
          )}

       </Box>
   </Box>
    
  );
  
     

   
  
}

export default Chats
