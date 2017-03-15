import axios from 'axios';
import api from '../apiURI';

export const GET = "GET_SERIE";
export const PENDING = "PENDING";

export const pending = () => ({
  type: PENDING,
});

export const fetched = serie => ({
  type: GET,
  payload: serie,
});

export const getSeriePage = ({
  id,
} = {}) => (dispatch) => {
  console.log('id action' , id);
  dispatch(pending());
  axios.get(
    `${api}/serie/${id}`,
  )
  .then(({ data: serie }) => {
    dispatch(fetched(...serie));
  })
  .catch(console.error)
};
