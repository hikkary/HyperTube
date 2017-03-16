import axios from 'axios';
import api from '../apiURI';
import _ from 'lodash';

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
    // const test = _.flattenDepth(movie.results, 1);
    // console.log('test action', movie.finalInfos);
    dispatch(fetched(movie));
  })
  .catch(console.error);
};
