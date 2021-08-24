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
  previewTextSeen: {
    fontSize: 12,
    color: "#9CADC8",
    letterSpacing: -0.17,
    width: "150px",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  },
  previewTextUnseen: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#000000de",
    letterSpacing: -0.17,
    width: "150px",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
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
          className={
            unseenAlert ? classes.previewTextUnseen : classes.previewTextSeen
          }
        >
          {latestMessageText}
        </Typography>
      </Box>
    </Box>
  );
};

export default ChatContent;
