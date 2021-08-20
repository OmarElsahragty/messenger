export const addMessageToStore = (state, payload) => {
  const { message, sender } = payload;
  // if sender isn't null, that means the message needs to be put in a brand new convo
  if (sender !== null) {
    const newConvo = {
      id: message.conversationId,
      otherUser: sender,
      messages: [message],
    };
    newConvo.latestMessageText = message.text;
    return [newConvo, ...state];
  }

  const stateCopy = [...state];
  const convoIndex = stateCopy.findIndex(
    (convo) => convo.id === message.conversationId
  );
  const convo = stateCopy[convoIndex];
  convo.messages.push(message);
  convo.latestMessageText = message.text;

  // * shifting the last conversation to the top (keeping the order of the rest conversations)
  if (convoIndex === 1) {
    [stateCopy[0], stateCopy[convoIndex]] = [
      stateCopy[convoIndex],
      stateCopy[0],
    ];
  } else if (convoIndex !== 0) {
    stateCopy.splice(convoIndex, 1);
    stateCopy.unshift(convo);
  }

  return stateCopy;
};

export const addOnlineUserToStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser.online = true;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const removeOfflineUserFromStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser.online = false;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const addSearchedUsersToStore = (state, users) => {
  const currentUsers = {};
  // make table of current users so we can lookup faster
  for (const convo of state) {
    currentUsers[convo.otherUser.id] = true;
  }

  const stateCopy = [...state];
  for (const user of users) {
    // only create a fake convo if we don't already have a convo with this user
    if (!currentUsers[user.id]) {
      const fakeConvo = { otherUser: user, messages: [] };
      stateCopy.push(fakeConvo);
    }
  }

  return stateCopy;
};

export const addNewConvoToStore = (state, recipientId, message) => {
  return state.map((convo) => {
    if (convo.otherUser.id === recipientId) {
      convo.id = message.conversationId;
      convo.messages.push(message);
      convo.latestMessageText = message.text;
      return convo;
    } else {
      return convo;
    }
  });
};
