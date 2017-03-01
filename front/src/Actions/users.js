import apiURI from '../apiURI';
import axios from 'axios';

export const ADDED = "USER_ADDED";

export const success = (message) => ({
  type: ADDED,
  payload: message ,
});

export const register = (data) => (dispatch) => {
  axios({
    method: 'POST',
    url: `${apiURI}/users`,
    data,
  }).then(({data :results}) => {
    console.log('result',results);
    console.log('status', results.status);
    console.log('details', results.details);
    if (results.status === true) {
      dispatch(success(results.details));
    }
  });
}
