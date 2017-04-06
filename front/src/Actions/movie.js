import axios from 'axios';
import api from '../apiURI';
import _ from 'lodash';

export const PENDING = "PENDING";
export const GET = "GET_MOVIE";
export const ERROR = "GET_ERROR_MOVIE";

export const pending = () => ({
  type: PENDING,
});

export const fetched = movie => ({
  type: GET,
  payload: movie,
});

export const error = error => ({
  type: ERROR,
  payload: error,
});


export const getMoviePage = ({
  id,
} = {}) => (dispatch) => {
  dispatch(pending());
  axios.get(
    `${api}/movie/${id}`,
  )
  .then(({ data: movie }) => {
    dispatch(fetched({ results: movie }));
  })
  .catch(console.error);
};

export const addCommentMovie = (
  comment,
  username,
  id,
  movie_id) => (dispatch) => {
  dispatch(pending());
  axios({
    method: 'PUT',
    url: `${api}/movie/comment`,
    data: {
      comment,
      username,
      id,
      movie_id,
    }
  })
    .then((results) => {
      if (results.data.errors) return dispatch(error(results.data));
      dispatch(fetched(results.data));
    })
    .catch(console.error);
};
