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
      console.log('results axios', results);
      dispatch(fetched(results.data));
    })
    .catch(console.error);
};
