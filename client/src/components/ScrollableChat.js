import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics";
import { ChatState } from "../context/ChatProvider";
import { Avatar, Tooltip } from "@chakra-ui/react";
import { useEffect } from "react";
import "./style.css";

const ScrollableChat = ({ messages, memeUrl }) => {
  const { user } = ChatState();

  useEffect(() => {
    console.log(memeUrl); // Check if memeUrl updates properly
  }, [memeUrl]);
  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex" }} key={m._id}>
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={m.sender.name}
                  src={m.sender.pic}
                />
              </Tooltip>
            )}

            <span
              style={{
                color: "black",
                backgroundColor: `${
                  m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                }`,
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
              }}
            >
              {m.messageType === "text" ? (
                // Render text message
                <span>{m.content}</span>
              ) : m.messageType === "meme" ? (
                // Render meme image
                <img
                  src={`data:image/png;base64,${m.content}`}
                  alt="Meme"
                  style={{ maxWidth: "150%", maxHeight: "250px" }}
                />
              ) : null}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
