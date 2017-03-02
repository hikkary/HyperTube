import apiURI from '../apiURI';
import axios from 'axios';

export const ADDED = "LOGGED_USER";
export const ERROR = "LOG_ERROR";
export const REFRESH = "LOG_REFRESH";

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


export const actionlogin = (data) => (dispatch) => {
  // dispatch(refresh())
  axios({
      method: 'POST',
      url: `${apiURI}/users/login`,
      data,
    }).then(({data :results, headers}) => {
      console.log(results.token);
      // console.log("head",head);
      if (results.status === true) {
        console.log(results);
        dispatch(success({results, headers}));
      } else {
        dispatch(error(results));
      }
    })
}
