import apiURI from '../apiURI';
import axios from 'axios';

export const ADDED = "REGISTERED_USER";
export const ERROR = "REGISTER_ERROR";
export const REFRESH = "REGISTER_REFRESH";

export const success = (message) => ({
  type: ADDED,
  payload: message ,
});

export const error = (message) => ({
  type: ERROR,
  payload: message ,
});

export const refresh = () => ({
  type: REFRESH,
});

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
      dispatch(success(results));
    } else {
      dispatch(error(results));
    }
  });
}
