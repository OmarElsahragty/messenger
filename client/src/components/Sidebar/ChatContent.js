import React from "react";
import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    justifyContent: "space-between",
    marginLeft: 20,
    flexGrow: 1,
  },
  box: {
    width: "100%",
  },
  username: {
    fontWeight: "bold",
    letterSpacing: -0.2,
  },
  previewText: {
    fontSize: 12,
    color: "#9CADC8",
    letterSpacing: -0.17,
    width: "150px",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  },
  unseen: {
    fontWeight: "bold",
    color: "#000000de !important",
  },
}));

const ChatContent = ({ latestMessageText, otherUser, unseenAlert }) => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <Box className={classes.box}>
        <Typography className={classes.username}>
          {otherUser.username}
        </Typography>
        <Typography
          className={`${classes.previewText} ${unseenAlert && classes.unseen}`}
        >
          {latestMessageText}
        </Typography>
      </Box>
    </Box>
  );
};

export default ChatContent;
