import React from "react";
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
  const classes = useStyles();

  const conversation = conversations.find(
    ({ id }) => activeConversation?.conversationId === id
  );

  return (
    <Box className={classes.root}>
      {activeConversation?.conversationId && conversation && (
        <>
          <Header
            participants={[user, ...conversation.users]}
            name={conversation.name}
            isOnline={conversation.onlineCount > 0}
            conversationId={conversation.id}
            messages={conversation.messages}
          />
          <Box className={classes.chatContainer}>
            <Messages
              userId={user.id}
              users={conversation.users}
              messages={conversation.messages}
            />
            <Input
              users={conversation.users}
              conversationId={conversation.id}
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
