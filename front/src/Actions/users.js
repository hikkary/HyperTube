import apiURI from '../apiURI';
import axios from 'axios';

export const ADDED = "USER_ADDED";
export const ERROR = "USER_ERROR";

export const success = (message) => ({
  type: ADDED,
  payload: message ,
});

export const error = (message) => ({
  type: ERROR,
  payload: message ,
});

export const register = (data) => (dispatch) => {
  axios({
    method: 'POST',
    url: `${apiURI}/users`,
    data,
  }).then(({data :results}) => {
    if (results.status === true) {
      dispatch(success(results.details));
    } else {
      dispatch(error(results.details));
    }
  });
}

export const login = (data) => (dispatch) => {
  axios({
    method: 'POST',
    url: `${apiURI}/users/login`,
    data,
  }).then(({data :results}) => {
    console.log(results.token);
    if (results.status === true) {
      dispatch(success(results));
    } else {
      dispatch(error(results.details));
    }
  });
}
