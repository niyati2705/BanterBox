export const getSender=(loggedUser, users)=>{
    //check users array, return without loggedin user
    return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
};

//full sender object
export const getSenderFull=(loggedUser, users)=>{
    //check users array, return without loggedin user
    return users[0]._id === loggedUser._id ? users[1] : users[0];
};

//check if same sender, m i ; current message and index
export const isSameSender = (messages, m, i, userId) => {
    return (
        //checks length of message, and if next message is neq to current sender, and if next message is undefined, and if curr message not from logged in user
      i < messages.length - 1 &&
      (messages[i + 1].sender._id !== m.sender._id ||
        messages[i + 1].sender._id === undefined) &&
      messages[i].sender._id !== userId
    );
  };

  //if last message of opposite user
  export const isLastMessage = (messages, i, userId) => {
    return (
        //check message length,id of ooposite sender of last message neq to logged in user and if that message exists
      i === messages.length - 1 && 
      messages[messages.length - 1].sender._id !== userId &&
      messages[messages.length - 1].sender._id
    );
  };


  export const isSameSenderMargin = (messages, m, i, userId) => {
    // console.log(i === messages.length - 1);
    //if same sender
    if (
      i < messages.length - 1 &&
      messages[i + 1].sender._id === m.sender._id &&
      messages[i].sender._id !== userId
    )
      return 33; //33 margin
    else if (
      (i < messages.length - 1 &&
        messages[i + 1].sender._id !== m.sender._id &&
        messages[i].sender._id !== userId) ||
      (i === messages.length - 1 && messages[i].sender._id !== userId)
    )
      return 0;
    else return "auto";
  };

  export const isSameUser = (messages, m, i) => {
    return i > 0 && messages[i - 1].sender._id === m.sender._id;
  };
  
  

  


