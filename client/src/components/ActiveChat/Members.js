import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  ListItem,
  List,
  IconButton,
  Typography,
  Avatar,
  Checkbox,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Close, CheckCircle, RadioButtonUnchecked } from "@material-ui/icons";
import { connect } from "react-redux";
import {
  addUserToConv,
  removeUserFromConv,
} from "../../store/utils/thunkCreators";

const useStyles = makeStyles(() => ({
  paper: { height: "60%", width: "50%" },
  root: {
    height: "60%",
    width: "50%",
  },
  buttonUnchecked: {
    fontSize: 23,
  },
  buttonChecked: {
    fontSize: 23,
  },
  avatar: {
    marginRight: 24,
  },
}));

const Members = ({
  visible,
  visibleabltyToggle,
  users = [],
  participants = [],
  addUserToConv,
  removeUserFromConv,
  conversationId,
  messages = [],
}) => {
  const [participantUsers, setParticipantUsers] = useState([]);

  const classes = useStyles();

  useEffect(() => {
    if (!visible) return;

    setParticipantUsers(
      users.map((user) => ({
        ...user,
        isParticipant: !!participants.find(
          (participant) => participant.id === user.id
        ),
      }))
    );
  }, [visible]);

  function handleClose() {
    setParticipantUsers([]);
    visibleabltyToggle();
  }

  const handleClick = async ({ isParticipant, ...user }) => {
    if (isParticipant) await removeUserFromConv(conversationId, user.id);
    else await addUserToConv(conversationId, user.id);

    setParticipantUsers((prev) => {
      const index = prev.findIndex((item) => item.id === user.id);

      prev[index].isParticipant = !prev[index].isParticipant;

      return prev;
    });
  };

  return (
    <Dialog
      open={visible}
      onClose={handleClose}
      classes={{ paper: classes.paper }}
    >
      <DialogTitle disableTypography>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid participant>
            <Typography>Members</Typography>
          </Grid>

          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </Grid>
      </DialogTitle>

      <DialogContent dividers>
        <List component="div" disablePadding>
          {participantUsers.map((user) => (
            <ListItem key={user.id}>
              <Grid
                container
                wrap="nowrap"
                alignItems="center"
                justifyContent="space-between"
              >
                <Grid container wrap="nowrap" alignItems="center">
                  <Avatar
                    className={classes.avatar}
                    alt={user.username}
                    src={user.photoUrl}
                  />
                  <Typography>{user.username}</Typography>
                </Grid>
                {!messages.find(({ senderId }) => user.id === senderId) && (
                  <Checkbox
                    defaultChecked={user.isParticipant}
                    onClick={() => handleClick(user)}
                    icon={
                      <RadioButtonUnchecked
                        classes={{ root: classes.buttonUnchecked }}
                      />
                    }
                    checkedIcon={
                      <CheckCircle classes={{ root: classes.buttonChecked }} />
                    }
                  />
                )}
              </Grid>
            </ListItem>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  );
};

const mapStateToProps = (state) => {
  return {
    users: state.users,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addUserToConv: (conversationId, userId) => {
      dispatch(addUserToConv(conversationId, userId));
    },
    removeUserFromConv: (conversationId, userId) => {
      dispatch(removeUserFromConv(conversationId, userId));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Members);
