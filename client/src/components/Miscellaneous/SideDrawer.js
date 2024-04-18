import { Box, Text } from "@chakra-ui/layout";
import { Input } from "@chakra-ui/input";
import {Button}  from "@chakra-ui/button";
import {Tooltip} from "@chakra-ui/tooltip";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import {
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
  } from "@chakra-ui/menu";
import {
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
} from "@chakra-ui/modal";
import { Avatar } from "@chakra-ui/avatar";
import { Spinner } from "@chakra-ui/spinner";
import {useDisclosure} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/toast";

import ProfileModal from "./ProfileModal";

import { useHistory } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { ChatState } from "../../context/ChatProvider";
import ChatLoading from "../ChatLoading";
import UserListItem from "../userAvatar/UserListItem";
// import { getSender } from "../../config/ChatLogics";


const SideDrawer = () => {

    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);

    const {user, setSelectedChat, chats, setChats} = ChatState();
    const history = useHistory();
    const toast = useToast();

    const {isOpen, onOpen, onClose} = useDisclosure();

    const handleLogout = () => {
        localStorage.removeItem("userInfo");
        history.push("/");
    };

    const handleSearch = async () =>{
      if(!search){
        toast({
          title: "Please Enter something in search",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top-left",
        });
        return;
      }
      try {
        setLoading(true);
        
        //headers for protected route
        const config = {
          headers: {
         
            Authorization: `Bearer ${user.token}`,
          },
        };
        //data from api call
        const { data } = await axios.get(`/api/user?search=${search}`, config);
  
        setLoading(false);
        setSearchResult(data);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to Load the Search Results",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
      }
    }

    const accessChat= async (userId) =>{
      try {
        setLoadingChat(true);
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        //api request to craete chat
        const { data } = await axios.post(`/api/chat`, { userId }, config);

        //append chat list if it already exists
        if(!chats.find((c) => c._id === data._id)) setChats([data,...chats]);

        setSelectedChat(data);
        setLoadingChat(false);
        onClose();
      } catch (error) {
        toast({
          title: "Error fetching the chat",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
      }
    }
    

    return (
      //header
      <>
    <Box
    display="flex"
    justifyContent="space-between"
    alignItems="center"
    bg="black"
    w="100%"
    p="5px 10px 5px 10px"
    borderWidth="5px"
    >
      <Tooltip variant="ghost" label="Search Users to chat" hasArrow placement="bottom-end">
          <Button onClick ={onOpen}>
            <Text d={{ base: "none", md: "flex" }} px={2}>
              Search User
            </Text>
          </Button>
        </Tooltip>

        <Text fontSize="2xl" fontFamily="Work sans">
            BanterBox
        </Text>

        <div>
            <Menu>
                <MenuButton p={1}>
                    <BellIcon fontSize="2xl" m={1}/>
                </MenuButton>
                {/* <MenuList></MenuList> */}
            </Menu>

            <Menu>
                 <MenuButton as={Button} rightIcon={<ChevronDownIcon/>}>
                    <Avatar size='sm' cursor='pointer' name={user.name} 
                    src={user.pic}
                     />
                </MenuButton>

                <MenuList bg="black">
                    <ProfileModal user={user}>
                         <MenuItem bg="black">My Profile</MenuItem>
                    </ProfileModal>
                    <MenuDivider />
                    <MenuItem bg="black" onClick={handleLogout}>Logout</MenuItem>
                </MenuList>
            </Menu>
        </div>
    </Box>

    {/* search user drawer */}
    <Drawer placement="left" onClose={onClose} isOpen ={isOpen}>
      <DrawerOverlay/>
      <DrawerContent>
        <DrawerHeader borderBottom="1px" bg="darkgrey"> Search Users</DrawerHeader>
        <DrawerBody bg="black">
          <Box display="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search} color="white"
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button  onClick={handleSearch}>Go</Button>
          </Box>
          {loading ? 
            <ChatLoading/>:(
              searchResult?.map((user)=>(
               <UserListItem
                key={user._id}
                user={user}
                handleFunction={()=>accessChat(user._id)}
               />
              ))
            )
          }
           {loadingChat && <Spinner ml="auto" d="flex" />}
      </DrawerBody>
      </DrawerContent>
    </Drawer>

    </>
  )
}

export default SideDrawer
