import apiURI from '../apiURI';
import axios from 'axios';
import { browserHistory } from 'react-router';

export const ADDED = "LOGGED_USER";
export const REGISTER = "REGISTERED_USER";
export const ERROR = "ERROR";
export const GET = "GET_USER";

export const successLogin = (message) => ({
  type: ADDED,
  payload: message ,
});

export const successRegister = (message) => ({
  type: REGISTER,
  payload: message ,
});

export const user = (data) => ({
  type: GET,
  payload: data,
});

export const error = (message) => ({
  type: ERROR,
  payload: message ,
});


export const actionLogin = (data) => (dispatch) => {
  axios({
    method: 'PUT',
    url: `${apiURI}/users/login`,
    data,
  })
  .then(({data :results, headers}) => {
    if (results.status === true) {
      dispatch(successLogin({ results, headers }));
      browserHistory.push('/app/homePage');
    } else {
      dispatch(error({results, headers}));
    }
  }).catch(() => null);
};

export const register = (data) => (dispatch) => {
  axios({
    method: 'POST',
    url: `${apiURI}/users/register`,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data,
  })
  .then(({ data: results }) => {
    if (results.status === true) {
      dispatch(successRegister(results));
    } else {
      dispatch(error(results));
    }
  }).catch(() => null);
};

export const getConnectedUser = (token) => (dispatch) => {
  axios({
    method: 'GET',
    url: `${apiURI}/users/connectedUser`,
    headers: {
         'Authorization': `Bearer ${token}`,
       },
  }).then(({ data: results, headers }) => {
    if (results.status === true) {
      dispatch(user(results.details, headers));
    } else {
      dispatch(error(results.details, headers));
    }
  }).catch(() => null);
};
