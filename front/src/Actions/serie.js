import axios from 'axios';
import api from '../apiURI';

export const GET = "GET_SERIE";
export const PENDING = "PENDING";

export const pending = () => ({
  type: PENDING,
});

export const display = (serie) => ({
  type: GET,
  payload: serie,
});


export const getSeriePage = ({
  id,
} = {}) => (dispatch) => {
  dispatch(pending());
  axios.get(
    `${api}/series/${id}`,
  )
  .then(({ data: serie }) => {
    // console.log("Series  :" ,typeof(series))
    // console.log("Series  :" ,series)
    dispatch(display(...serie));
  })
  .catch(console.error)
};
