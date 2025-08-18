import React, { useContext, useState } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";

import {
  IconPaperclip,
  IconPhoto,
  IconSend,
} from "@tabler/icons-react";
import { ChatContext } from "@/context/ChatContext";

const ChatMsgSent = () => {
  const [msg, setMsg] = useState("");

  const { sendMessage, selectedChat } = useContext(ChatContext);


  const handleChatMsgChange = (e) => {
    setMsg(e.target.value);
  };


  const onChatMsgSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!msg.trim() || !selectedChat) return;
    sendMessage(selectedChat.id, msg.trim());
    setMsg("");
  };

  return (
    <Box p={2}>
      {/* ------------------------------------------- */}
      {/* sent chat */}
      {/* ------------------------------------------- */}
      <form
        onSubmit={onChatMsgSubmit}
        style={{ display: "flex", gap: "10px", alignItems: "center" }}
      >
        {/* ------------------------------------------- */}
        {/* Emoji picker */}
        {/* ------------------------------------------- */}

        <InputBase
          id="msg-sent"
          fullWidth
          value={msg}
          placeholder="Type a Message"
          size="small"
          type="text"
          inputProps={{ "aria-label": "Type a Message" }}
          onChange={handleChatMsgChange.bind(null)}
        />
        <IconButton
          aria-label="delete"
          onClick={() => {
            sendMessage(selectedChat?.id || "", msg);
            setMsg("");
          }}
          disabled={!msg}
          color="primary"
        >
          <IconSend stroke={1.5} size="20" />
        </IconButton>
        <IconButton aria-label="delete">
          <IconPhoto stroke={1.5} size="20" />
        </IconButton>
        <IconButton aria-label="delete">
          <IconPaperclip stroke={1.5} size="20" />
        </IconButton>
      </form>
    </Box>
  );
};

export default ChatMsgSent;
