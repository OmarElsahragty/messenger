import React from "react";
import { Box, Badge, Avatar } from "@material-ui/core";
import { PeopleAlt } from "@material-ui/icons";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  profilePic: {
    height: 44,
    width: 44,
  },
  badge: {
    height: 13,
    width: 13,
    borderRadius: "50%",
    border: "2px solid white",
    backgroundColor: "#D0DAE9",
  },
  online: {
    backgroundColor: "#1CED84",
  },
  sidebar: {
    marginLeft: 17,
  },
}));

const UserAvatar = ({ sidebar, name, photoUrl, isOnline }) => {
  const classes = useStyles();

  return (
    <Box className={sidebar ? classes.sidebar : ""}>
      <Badge
        classes={{ badge: `${classes.badge} ${isOnline && classes.online}` }}
        variant="dot"
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        overlap="circular"
      >
        <Avatar alt={name} className={classes.profilePic} src={photoUrl}>
          {!photoUrl && <PeopleAlt />}
        </Avatar>
      </Badge>
    </Box>
  );
};

export default UserAvatar;
