import React from "react";
import { Box, Badge } from "@material-ui/core";
import { BadgeAvatar, ChatContent } from "../Sidebar";
import { makeStyles } from "@material-ui/core/styles";
import { setActiveChat } from "../../store/activeConversation";
import { conversationSeen } from "../../store/conversations";
import { patchUnseenMessages } from "../../store/utils/thunkCreators";
import { connect } from "react-redux";

const useStyles = makeStyles(() => ({
  root: {
    borderRadius: 8,
    height: 80,
    boxShadow: "0 2px 10px 0 rgba(88,133,196,0.05)",
    marginBottom: 10,
    display: "flex",
    alignItems: "center",
    "&:hover": {
      cursor: "grab",
    },
  },
  badge: {
    position: "relative",
    left: -15,
  },
}));

const Chat = ({
  setActiveChat,
  conversationSeen,
  conversationId,
  otherUser,
  isOnline,
  latestMessageText,
  unseenMessagesCount,
}) => {
  const classes = useStyles();

  const handleClick = async () => {
    await conversationSeen(otherUser.id);
    await setActiveChat(otherUser.username);
    patchUnseenMessages(conversationId);
  };

  return (
    <Box onClick={handleClick} className={classes.root}>
      <BadgeAvatar
        photoUrl={otherUser.photoUrl}
        username={otherUser.username}
        online={isOnline}
        sidebar={true}
      />
      <ChatContent
        otherUser={otherUser}
        latestMessageText={latestMessageText}
        unseenAlert={unseenMessagesCount > 0}
      />

      <Badge
        color="primary"
        className={classes.badge}
        badgeContent={unseenMessagesCount}
      />
    </Box>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    setActiveChat: (id) => {
      dispatch(setActiveChat(id));
    },
    conversationSeen: (recipientId) => {
      dispatch(conversationSeen(recipientId));
    },
  };
};

export default connect(null, mapDispatchToProps)(Chat);
