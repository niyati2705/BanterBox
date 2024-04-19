import {createContext, useContext, useEffect, useState } from 'react';
import { useHistory} from 'react-router-dom';

const ChatContext = createContext();

const ChatProvider = ({children}) =>{

    const history = useHistory()
    const[user, setUser] = useState();
    const [notification, setNotification] = useState([]);

    //check if user is logged in

    useEffect(()=>{
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        // setUser(userInfo);

        // //if user not logged in
        // if(!userInfo){
        //     history.push('/');
        // }
        
  // If user is logged in, set the user state
  if (userInfo) {
    setUser(userInfo);
    console.log(userInfo);
  } else {
    // If user is not logged in, redirect to login page
    history.push('/');
  }

    },[history]); //run again whenever history changes
    const[selectedChat, setSelectedChat] = useState();
    const [chats, setChats] = useState([]);
  

    return(
        <ChatContext.Provider value={{user,setUser , selectedChat, setSelectedChat, chats, setChats, notification, setNotification}}>
            {children}
        </ChatContext.Provider>

    )
};

export const ChatState = () =>{

    return useContext(ChatContext);
};


export default ChatProvider;