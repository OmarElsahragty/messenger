export const addMessageToStore = (state, payload) => {
  const { message, userId, activeConversation } = payload;

  const stateCopy = [...state];

  const convoIndex = stateCopy.findIndex(
    (convo) =>
      typeof convo.id === "number" && convo.id === message.conversationId
  );

  stateCopy[convoIndex].messages.push(message);
  stateCopy[convoIndex].latestMessageText = message.text;

  if (
    userId &&
    userId !== message.senderId &&
    stateCopy[convoIndex]?.id !== activeConversation?.conversationId
  ) {
    stateCopy[convoIndex].unseenMessagesCount++;
  }

  // shifting the last conversation to the top (keeping the order of the rest conversations)
  if (convoIndex === 1) {
    [stateCopy[0], stateCopy[1]] = [stateCopy[1], stateCopy[0]];
  } else if (convoIndex !== 0) {
    stateCopy.unshift(stateCopy[convoIndex]);
    stateCopy.splice(convoIndex + 1, 1);
  }

  return stateCopy;
};

export const addOnlineUserToStore = (state, userId) => {
  return state.map((convo) => {
    if (convo.users.find((user) => user.id === userId)) {
      const convoCopy = { ...convo };
      convoCopy.onlineCount++;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const removeOfflineUserFromStore = (state, userId) => {
  return state.map((convo) => {
    if (convo.users.find((user) => user.id === userId)) {
      const convoCopy = { ...convo };
      convoCopy.onlineCount--;
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
    if (convo.users.length === 1) currentUsers[convo.users[0].id] = true;
  }

  const stateCopy = [...state];
  for (const user of users) {
    // only create a fake convo if we don't already have a convo with this user
    if (!currentUsers[user.id]) {
      stateCopy.push({
        id: `fake-${user.id}`,
        createdAt: Date.now(),
        messages: [],
        users: [user],
        name: user.username,
        unseenMessagesCount: 0,
        photoUrl: user.photoUrl,
        latestMessageText: null,
        lastSeen: Date.now(),
        online: user.online,
      });
    }
  }

  return stateCopy;
};

export const addNewConvoToStore = (state, NewConvo) => {
  const stateCopy = [...state];
  const fakeConversationIndex = stateCopy.findIndex(
    (conversation) =>
      typeof conversation.id === "string" &&
      conversation.users[0].username === NewConvo.users[0].username
  );

  stateCopy.splice(fakeConversationIndex, 1);

  return [NewConvo, ...stateCopy];
};

export const updateUnseenMessagesInStore = (state, conversationId) => {
  return state.map((conversation) => {
    if (conversation.id === conversationId) {
      const convoCopy = { ...conversation };
      convoCopy.unseenMessagesCount = 0;
      return convoCopy;
    }
    return conversation;
  });
};

export const addConvoUser = (state, { user, conversationId }) => {
  const stateCopy = [...state];

  const conversationIndex = stateCopy.findIndex(
    ({ id }) => conversationId === id
  );

  stateCopy[conversationIndex].users.push(user);

  stateCopy[conversationIndex].photoUrl = null;

  stateCopy[conversationIndex].name = stateCopy[conversationIndex].users
    .map(({ username }) => username)
    .join(", ");

  return stateCopy;
};

export const removeConvoUser = (state, { userId, conversationId }) => {
  const stateCopy = [...state];

  const conversationIndex = stateCopy.findIndex(
    ({ id }) => conversationId === id
  );
  const userIndex = stateCopy[conversationIndex].users.findIndex(
    ({ id }) => userId === id
  );

  stateCopy[conversationIndex].users.splice(userIndex, 1);

  stateCopy[conversationIndex].name = stateCopy[conversationIndex].users
    .map(({ username }) => username)
    .join(", ");

  stateCopy[conversationIndex].photoUrl =
    stateCopy[conversationIndex].users.length === 1
      ? stateCopy[conversationIndex].users[0].photoUrl
      : null;

  return stateCopy;
};
