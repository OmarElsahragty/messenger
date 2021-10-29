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
  name: {
    width: "60%",
    fontWeight: "bold",
    letterSpacing: -0.2,
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  },
  previewTextSeen: {
    fontSize: 12,
    color: "#9CADC8",
    letterSpacing: -0.17,
    width: "150px",
    overflow: "hidden",
    whiteSpace: "nowrap",
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

const ChatContent = ({ name, latestMessageText, unseenAlert }) => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <Box className={classes.box}>
        <Typography className={classes.name}>{name}</Typography>
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
