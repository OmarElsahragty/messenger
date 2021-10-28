import axios from "axios";
import socket from "../../socket";
import {
  gotConversations,
  addConversation,
  setSearchedUsers,
  setNewMessage,
  addUserToConvAction,
  removeUserFromConvAction,
} from "../conversations";
import { setUsers } from "../users";
import { gotUser, setFetchingStatus } from "../user";

axios.interceptors.request.use(async function (config) {
  const token = await localStorage.getItem("messenger-token");
  config.headers["x-access-token"] = token;

  return config;
});

// USER THUNK CREATORS

export const fetchUser = () => async (dispatch) => {
  dispatch(setFetchingStatus(true));
  try {
    const { data } = await axios.get("/auth/user");
    dispatch(gotUser(data));
    if (data.id) {
      socket.emit("go-online", { userId: data.id });
    }
  } catch (error) {
    console.error(error);
  } finally {
    dispatch(setFetchingStatus(false));
  }
};

export const register = (credentials) => async (dispatch) => {
  try {
    const { data } = await axios.post("/auth/register", credentials);
    await localStorage.setItem("messenger-token", data.token);
    dispatch(gotUser(data));
    socket.emit("go-online", { userId: data.id });
  } catch (error) {
    console.error(error);
    dispatch(gotUser({ error: error.response.data.error || "Server Error" }));
  }
};

export const login = (credentials) => async (dispatch) => {
  try {
    const { data } = await axios.post("/auth/login", credentials);
    await localStorage.setItem("messenger-token", data.token);
    dispatch(gotUser(data));
    socket.emit("go-online", { userId: data.id });
  } catch (error) {
    console.error(error);
    dispatch(gotUser({ error: error.response.data.error || "Server Error" }));
  }
};

export const logout = (id) => async (dispatch) => {
  try {
    await axios.delete("/auth/logout");
    await localStorage.removeItem("messenger-token");
    dispatch(gotUser({}));
    socket.emit("logout", id);
  } catch (error) {
    console.error(error);
  }
};

// CONVERSATIONS THUNK CREATORS

export const fetchConversations = () => async (dispatch) => {
  try {
    const { data } = await axios.get("/api/conversations");
    dispatch(gotConversations(data));
    await Promise.all(
      data.forEach((conversation) => {
        socket.emit("go-online", { conversationId: conversation.id });
      })
    );
  } catch (error) {
    console.error(error);
  }
};

const saveMessage = async (body) => {
  const { data } = await axios.post("/api/messages", body);
  return data;
};

const sendMessage = (data) => {
  socket.emit("new-message", data);
};

// message format to send: {recipientId, text, conversationId}
// conversationId will be set to null if its a brand new conversation
export const postMessage = (body) => async (dispatch) => {
  try {
    const data = await saveMessage(body);

    if (!body.conversationId) {
      dispatch(addConversation(data));
      sendMessage({ ...data.messages[0], conversationId: data.id });
    } else {
      sendMessage(data);
      dispatch(setNewMessage(data));
    }
  } catch (error) {
    console.error(error);
  }
};

export const searchUsers = (searchTerm) => async (dispatch) => {
  try {
    const { data } = await axios.get(`/api/users/${searchTerm}`);
    dispatch(setSearchedUsers(data));
  } catch (error) {
    console.error(error);
  }
};

export const patchUnseenMessages = async (conversationId) => {
  const { data } = await axios.patch(
    `/api/conversations/markAsSeen/${conversationId}`
  );
  return data;
};

export const getUsers = () => async (dispatch) => {
  try {
    const { data } = await axios.get("/api/users");
    dispatch(setUsers(data));
  } catch (error) {
    console.error(error);
  }
};

export const addUserToConv = (conversationId, userId) => async (dispatch) => {
  try {
    const { data } = await axios.post(
      `/api/conversations/${conversationId}/user/${userId}`
    );
    dispatch(addUserToConvAction(data));
  } catch (error) {
    console.error(error);
  }
};

export const removeUserFromConv =
  (conversationId, userId) => async (dispatch) => {
    try {
      const { data } = await axios.delete(
        `/api/conversations/${conversationId}/user/${userId}`
      );
      dispatch(removeUserFromConvAction(data));
    } catch (error) {
      console.error(error);
    }
  };
