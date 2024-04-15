import {ChatState} from "../context/ChatProvider";
import SideDrawer from "../components/Miscellaneous/SideDrawer";
import Chats from "../components/Chats";
import Chatbox from "../components/ChatBox";
import { useState } from "react";

import { Box } from "@chakra-ui/layout";

const Chatpage = () => {

  const {user} = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false)
  console.log(user);

  // const[chats, setChats] = useState([]);

  // //api call to render data from backend to frontend
  // const fetchChats = async () => {
  //   //fetch api
  //   //desrtucture data from api
  //   const {data} = await axios.get("/api/chat");
  //   setChats(data);
  // };

  // useEffect(() => {
  //   fetchChats();
  // },[])

  return (
    <div style={{ width: "100%" }}>

    {user && <SideDrawer />}
    <Box display="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
       {user && <Chats fetchAgain={fetchAgain}/>} 
     {user && 
        <Chatbox fetchAgain={fetchAgain} setFetchAgain = {setFetchAgain}/>}  
    </Box>
  </div>
  )
}

export default Chatpage
