import apiURI from '../apiURI';
import axios from 'axios';
import { browserHistory } from 'react-router';

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
  console.log("TEST");
  axios({
      method: 'PUT',
      url: `${apiURI}/users/login`,
      data,
    }).then(({data :results, headers}) => {
      if (results.status === true) {
        console.log('results', results);
        dispatch(success({results, headers}));
        browserHistory.push('/app');
      } else {
        dispatch(error(results));
      }
    })
}
