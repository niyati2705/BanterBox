import React, { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';


const Chatpage = () => {

  const[chats, setChats] = useState([]);

  //api call to render data from backend to frontend
  const fetchChats = async () => {
    //fetch api
    //desrtucture data from api
    const {data} = await axios.get("/api/chat");
    setChats(data);
  };

  useEffect(() => {
    fetchChats();
  },[])

  return (
    <div>
      {chats.map((chat)=>(
        <div key={chat._id}>{chat.chatName}</div>
      ))}
  </div>
  )
}

export default Chatpage
