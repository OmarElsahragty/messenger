import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";
import { Input, Header, Messages } from "./index";
import { connect } from "react-redux";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flexGrow: 8,
    flexDirection: "column",
  },
  chatContainer: {
    marginLeft: 41,
    marginRight: 41,
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    justifyContent: "space-between",
  },
}));

const ActiveChat = ({ user, conversations, activeConversation }) => {
  const [conversation, setConversation] = useState({});

  const classes = useStyles();

  // * Get current conversation each time activeConversation or conversations change
  useEffect(() => {
    setConversation(
      (conversations &&
        conversations.find(
          (conversation) =>
            conversation.otherUser.username === activeConversation
        )) ||
        {}
    );
  }, [conversations, activeConversation]);

  return (
    <Box className={classes.root}>
      {conversation.otherUser && (
        <>
          <Header
            username={conversation.otherUser.username}
            online={conversation.otherUser.online || false}
          />
          <Box className={classes.chatContainer}>
            <Messages
              messages={conversation.messages}
              otherUser={conversation.otherUser}
              userId={user.id}
            />
            <Input
              otherUser={conversation.otherUser}
              conversationId={conversation.id}
              user={user}
            />
          </Box>
        </>
      )}
    </Box>
  );
};

const mapStateToProps = ({ user, conversations, activeConversation }) => ({
  user,
  conversations,
  activeConversation,
});

export default connect(mapStateToProps, null)(ActiveChat);
