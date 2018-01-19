import {
  LOGIN,
  LOGOUT,
} from "../actions";

const initialState = {
  token: null,
};

export default function auth(state = initialState, action = {}) {
  switch (action.type) {
    case LOGIN:
      return {
        token: action.payload
      };
    case LOGOUT:
      return {
        token: null
      };
    default:
      return state;
  }
}
