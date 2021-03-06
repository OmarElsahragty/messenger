import React from "react";
import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { Search, Chat, CurrentUser } from "./index.js";

const useStyles = makeStyles(() => ({
  root: {
    paddingLeft: 21,
    paddingRight: 21,
    flexGrow: 1,
  },
  title: {
    fontSize: 20,
    letterSpacing: -0.29,
    fontWeight: "bold",
    marginTop: 32,
    marginBottom: 15,
  },
}));

const Sidebar = ({ handleChange, searchTerm, conversations }) => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <CurrentUser />
      <Typography className={classes.title}>Chats</Typography>
      <Search handleChange={handleChange} />
      {conversations
        .filter(({ name }) => name.includes(searchTerm))
        .map((conversation) => (
          <Chat
            key={conversation.id}
            name={conversation.name}
            users={conversation.users}
            conversationId={conversation.id}
            photoUrl={conversation.photoUrl}
            isOnline={conversation.onlineCount > 0}
            latestMessageText={conversation.latestMessageText}
            unseenMessagesCount={conversation.unseenMessagesCount}
          />
        ))}
    </Box>
  );
};

const mapStateToProps = (state) => ({
  conversations: state.conversations ?? [],
});

export default connect(mapStateToProps)(Sidebar);
