const SET_ACTIVE_CHAT = "SET_ACTIVE_CHAT";

export const setActiveChat = (data) => {
  return {
    type: SET_ACTIVE_CHAT,
    data,
  };
};

const reducer = (state = {}, action) => {
  switch (action.type) {
    case SET_ACTIVE_CHAT: {
      return action.data;
    }
    default:
      return state;
  }
};

export default reducer;
