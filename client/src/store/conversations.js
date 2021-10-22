import {
  addNewConvoToStore,
  addOnlineUserToStore,
  addSearchedUsersToStore,
  removeOfflineUserFromStore,
  addMessageToStore,
  updateUnseenMessagesInStore,
  addConvoUser,
  removeConvoUser,
} from "./utils/reducerFunctions";

// ACTIONS

const GET_CONVERSATIONS = "GET_CONVERSATIONS";
const SET_MESSAGE = "SET_MESSAGE";
const ADD_ONLINE_USER = "ADD_ONLINE_USER";
const REMOVE_OFFLINE_USER = "REMOVE_OFFLINE_USER";
const SET_SEARCHED_USERS = "SET_SEARCHED_USERS";
const CLEAR_SEARCHED_USERS = "CLEAR_SEARCHED_USERS";
const ADD_CONVERSATION = "ADD_CONVERSATION";
const MARK_CONVERSATION_AS_SEEN = "MARK_CONVERSATION_AS_SEEN";
const ADD_USER_CONV = "ADD_USER_CONV";
const REMOVE_USER_CONV = "REMOVE_USER_CONV";

// ACTION CREATORS

export const gotConversations = (conversations) => {
  return {
    type: GET_CONVERSATIONS,
    conversations,
  };
};

export const setNewMessage = (message, userId, activeConversation) => {
  return {
    type: SET_MESSAGE,
    payload: { message, userId, activeConversation },
  };
};

export const addOnlineUser = (id) => {
  return {
    type: ADD_ONLINE_USER,
    id,
  };
};

export const removeOfflineUser = (id) => {
  return {
    type: REMOVE_OFFLINE_USER,
    id,
  };
};

export const setSearchedUsers = (users) => {
  return {
    type: SET_SEARCHED_USERS,
    users,
  };
};

export const clearSearchedUsers = () => {
  return {
    type: CLEAR_SEARCHED_USERS,
  };
};

// add new conversation when sending a new message
export const addConversation = (conversation) => {
  return {
    type: ADD_CONVERSATION,
    payload: { conversation },
  };
};

export const conversationSeen = (conversationId) => {
  return {
    type: MARK_CONVERSATION_AS_SEEN,
    payload: conversationId,
  };
};

export const addUserToConvAction = (data) => {
  return {
    type: ADD_USER_CONV,
    data,
  };
};

export const removeUserFromConvAction = (data) => {
  return {
    type: REMOVE_USER_CONV,
    data,
  };
};

// REDUCER

const reducer = (state = [], action) => {
  switch (action.type) {
    case GET_CONVERSATIONS:
      return action.conversations;
    case SET_MESSAGE:
      return addMessageToStore(state, action.payload);
    case ADD_ONLINE_USER: {
      return addOnlineUserToStore(state, action.id);
    }
    case REMOVE_OFFLINE_USER: {
      return removeOfflineUserFromStore(state, action.id);
    }
    case SET_SEARCHED_USERS:
      return addSearchedUsersToStore(state, action.users);
    case CLEAR_SEARCHED_USERS:
      return state.filter((convo) => convo.id);
    case ADD_CONVERSATION:
      return addNewConvoToStore(state, action.payload.conversation);
    case MARK_CONVERSATION_AS_SEEN:
      return updateUnseenMessagesInStore(state, action.payload);
    case ADD_USER_CONV: {
      return addConvoUser(state, action.data);
    }
    case REMOVE_USER_CONV: {
      return removeConvoUser(state, action.data);
    }
    default:
      return state;
  }
};

export default reducer;
