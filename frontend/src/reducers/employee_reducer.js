import {
  LOAD_EMPLOYEE_DATA,
  LOGOUT,
} from "../actions";

const initialState = {
  reviewFeedbacks: null,
};

export default function employee(state = initialState, action = {}) {
  switch (action.type) {
    case LOGOUT:
      return { ...initialState };
    case LOAD_EMPLOYEE_DATA:
      return {
        reviewFeedbacks: action.payload.reviewFeedbacks,
      };
    default:
      return state;
  }
}
