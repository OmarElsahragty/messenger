const SET_USERS = "SET_USERS";

export const setUsers = (data) => {
  return {
    type: SET_USERS,
    data,
  };
};

const reducer = (state = {}, action) => {
  switch (action.type) {
    case SET_USERS: {
      return action.data;
    }
    default:
      return state;
  }
};

export default reducer;
