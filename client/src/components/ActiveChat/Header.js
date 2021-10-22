import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Typography, IconButton } from "@material-ui/core";
import { Group } from "@material-ui/icons";
import MembersDialog from "./Members";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: 89,
    marginBottom: 34,
    boxShadow: "0 2px 20px 0 rgba(88,133,196,0.10)",
  },
  content: {
    display: "flex",
    alignItems: "center",
    marginLeft: 24,
  },
  name: {
    fontSize: 20,
    letterSpacing: -0.29,
    fontWeight: "bold",
    marginRight: 14,
  },
  statusText: {
    fontSize: 12,
    color: "#BFC9DB",
    letterSpacing: -0.17,
  },
  statusDot: {
    height: 8,
    width: 8,
    borderRadius: "50%",
    marginRight: 5,
    backgroundColor: "#D0DAE9",
  },
  online: {
    background: "#1CED84",
  },
  groupIcon: {
    color: "#95A7C4",
    marginRight: 24,
    opacity: 0.5,
  },
}));

const Header = ({ name, isOnline, participants, conversationId }) => {
  const [MembersDialogVisibleablty, setMembersDialogVisibleablty] =
    useState(false);

  const MembersDialogVisibleabltyToggle = () =>
    setMembersDialogVisibleablty((prev) => !prev);

  const classes = useStyles();

  return (
    <>
      <Box className={classes.root}>
        <Box className={classes.content}>
          <Typography className={classes.name}>{name}</Typography>
          <Box
            className={`${classes.statusDot} ${classes[isOnline && "online"]}`}
          ></Box>
          <Typography className={classes.statusText}>
            {isOnline ? "Online" : "Offline"}
          </Typography>
        </Box>
        <IconButton
          classes={{ root: classes.groupIcon }}
          onClick={MembersDialogVisibleabltyToggle}
        >
          <Group />
        </IconButton>
      </Box>
      <MembersDialog
        visible={MembersDialogVisibleablty}
        visibleabltyToggle={MembersDialogVisibleabltyToggle}
        participants={participants}
        conversationId={conversationId}
      />
    </>
  );
};

export default Header;
