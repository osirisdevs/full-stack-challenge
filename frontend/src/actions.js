import axios from 'axios';

// auth related
export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';

export const LOAD_ADMIN_DATA = 'LOAD_ADMIN_DATA';
export const LOAD_EMPLOYEE_DATA = 'LOAD_EMPLOYEE_DATA';


const SERVER_URL = 'http://localhost:8000/';


export function login(payload) {
  return dispatch => {
    axios.post(SERVER_URL + 'login/', payload).then(
      ({data}) => {
        // save token into localstorage for persistence
        localStorage.token = data.token
        dispatch(loginAction(data.token));
      }
    )
  }
}

export function logout() {
  return dispatch => {
    delete localStorage.token;
    dispatch({
      type: LOGOUT,
    });
  }
}

export function loginAction(token) {
  return {
    type: LOGIN,
    payload: token,
  };
}

export function checkAdminPrivileges() {
  return (dispatch, getState) => {
    const token = getState().auth.token;
    return axios.get(SERVER_URL + 'users/', {
      headers: {
        Authorization: `JWT ${token}`
      }
    });
  };
}

export function loadEmployeeData() {
  return (dispatch, getState) => {
    const token = getState().auth.token;
    const employeeDataRequest = axios.get(SERVER_URL + 'review-feedbacks/', {
      headers: {
        Authorization: `JWT ${token}`
      }
    });

    employeeDataRequest.then(({data}) => {
      dispatch({
        type: LOAD_EMPLOYEE_DATA,
        payload: {
          reviewFeedbacks: data,
        }
      });
    });
  };
}

export function putReviewFeedback(url, feedback) {
  return (dispatch, getState) => {
    const token = getState().auth.token;
    return axios.put(url, {
      feedback,
    }, {
      headers: {
        Authorization: `JWT ${token}`
      }
    });
  }
}

export function deleteUser(url) {
  return (dispatch, getState) => {
    const token = getState().auth.token;
    return axios.delete(url, {
      headers: {
        Authorization: `JWT ${token}`
      }
    });
  }
}

export function deletePerformanceReview(url) {
  return (dispatch, getState) => {
    const token = getState().auth.token;
    return axios.delete(url, {
      headers: {
        Authorization: `JWT ${token}`
      }
    });
  }
}

export function deleteReviewFeedback(url) {
  return (dispatch, getState) => {
    const token = getState().auth.token;
    return axios.delete(url, {
      headers: {
        Authorization: `JWT ${token}`
      }
    });
  }
}

export function putUser(url, data) {
  return (dispatch, getState) => {
    const token = getState().auth.token;
    return axios.put(url, data, {
      headers: {
        Authorization: `JWT ${token}`
      }
    });
  }
}

export function postNewUser(data) {
  return (dispatch, getState) => {
    const token = getState().auth.token;
    return axios.post(SERVER_URL + 'users/', data, {
      headers: {
        Authorization: `JWT ${token}`
      }
    });
  };
}

export function postNewPerformanceReview(reviewee) {
  return (dispatch, getState) => {
    const token = getState().auth.token;
    return axios.post(SERVER_URL + 'performance-reviews/', {
      reviewee
    }, {
      headers: {
        Authorization: `JWT ${token}`
      }
    });
  };
}

export function postNewReviewFeedback(data) {
  return (dispatch, getState) => {
    const token = getState().auth.token;
    return axios.post(SERVER_URL + 'review-feedbacks/', data, {
      headers: {
        Authorization: `JWT ${token}`
      }
    });
  };
}

export function loadAdminData() {
  return (dispatch, getState) => {
    const token = getState().auth.token;
    const adminUsersRequest = axios.get(SERVER_URL + 'users/', {
      headers: {
        Authorization: `JWT ${token}`
      }
    });
    // TODO: these 2 requests could be made in parallel instead of sequential
    adminUsersRequest.then(({ data }) => {
      const usersData = data;
      const adminPerformanceReviewsRequest = axios.get(SERVER_URL + 'performance-reviews/', {
        headers: {
          Authorization: `JWT ${token}`
        }
      });
      adminPerformanceReviewsRequest.then(({ data }) => {
        dispatch({
          type: LOAD_ADMIN_DATA,
          payload: {
            users: usersData,
            performanceReviews: data,
          }
        });
      });
    });
  };
}
