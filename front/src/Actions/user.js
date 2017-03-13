import apiURI from '../apiURI';
import axios from 'axios';
import { browserHistory } from 'react-router';

export const ADDED = "LOGGED_USER";
export const REGISTER = "REGISTERED_USER";
export const ERROR = "ERROR";
export const REFRESH = "LOG_REFRESH";
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

export const refresh = () => ({
  type: REFRESH,
});

export const actionLogin = (data) => (dispatch) => {
  console.log("TEST");
  axios({
      method: 'PUT',
      url: `${apiURI}/users/login`,
      data,
    }).then(({data :results, headers}) => {
      if (results.status === true) {
        console.log('results', results);
        dispatch(successLogin({ results, headers }));
        browserHistory.push('/app');
      } else {
        dispatch(error(results));
      }
    })
}

export const register = (data) => (dispatch) => {
  dispatch(refresh());
  axios({
    method: 'POST',
    url: `${apiURI}/users/register`,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data,
  }).then(({ data: results }) => {
    console.log('coucou');
    if (results.status === true) {
      dispatch(successRegister(results));
    } else {
      dispatch(error(results));
    }
  });
};

export const getConnectedUser = (token) => (dispatch) => {
  axios({
    method: 'GET',
    url: `${apiURI}/users/connectedUser`,
    headers: {
         'Authorization': `Bearer ${token}`,
       },
  }).then(({ data: results }) => {
    console.log('coucouuu');
    if (results.status === true) {
      dispatch(user(results));
    } else {
      dispatch(error(results));
    }
  })
}
