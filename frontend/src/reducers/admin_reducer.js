import {
  LOAD_ADMIN_DATA,
  LOGOUT,
} from "../actions";

const initialState = {
  users: null,
  performanceReviews: null
};

export default function admin(state = initialState, action = {}) {
  switch (action.type) {
    case LOGOUT:
      return { ...initialState };
    case LOAD_ADMIN_DATA:
      return {
        users: action.payload.users,
        performanceReviews: action.payload.performanceReviews,
      };
    default:
      return state;
  }
}
