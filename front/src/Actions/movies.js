import axios from 'axios';
import api from '../apiURI';

export const GET = 'MOVIE_GET';
export const PENDING = 'MOVIE_PENDING';

export const pending = () => ({
  type: PENDING,
});

export const display = movies => ({
  type: GET,
  payload: movies,
});

export const getMovie = () => (dispatch) => {
  dispatch(pending());
  axios.get(
    `${api}/movie/display`,
  )
  .then(({ data: movies}) => {
    dispatch(display(movies));
  })
  .catch(console.error)
}
