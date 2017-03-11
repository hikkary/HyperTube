import axios from 'axios';
import api from '../apiURI';

export const PENDING = "PENDING";
export const GET = "GET_MOVIE";

export const pending = () => ({
  type: PENDING,
});

export const fetched = movie => ({
  type: GET,
  payload: movie,
});

export const getMoviePage = ({
  id,
} = {}) => (dispatch) => {
  dispatch(pending());
  axios.get(
    `${api}/movie/${id}`,
  )
  .then(({ data: movie }) => {
    // console.log('TYPE DE NOVUE', typeof(movie));
    dispatch(fetched( ...movie));
  })
  .catch(console.error)
};
