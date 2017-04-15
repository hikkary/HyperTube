import axios from 'axios';
import api from '../apiURI';

export const GET = "GET_SERIE";
export const PENDING = "PENDING";
export const ERROR = "GET_ERROR_SERIE";
export const NOTFOUND = "NOTFOUND_SERIE";

export const pending = () => ({
  type: PENDING,
});

export const fetched = serie => ({
  type: GET,
  payload: serie,
});

export const error = error => ({
  type: ERROR,
  payload: error,
});

export const notFound = error => ({
  type: NOTFOUND,
  payload: error,
});

export const getSeriePage = ({
  id,
} = {}) => (dispatch) => {
  dispatch(pending());
  axios.get(
    `${api}/serie/${id}`,
  )
  .then(({ data: serie }) => {
    if (serie.errors) return dispatch(notFound(serie));
    dispatch(fetched(serie.results));
  })
  .catch(console.error);
};

export const getEpisode = ({
  id, serieId
} = {}) => (dispatch) => {
  dispatch(pending());
  axios.get(
    `${api}/serie/${serieId}/${id}`,
  )
  .then((response) => {
    if (response.data.errors) return dispatch(notFound(response.data));
    dispatch(fetched(response.data.details));
  })
  .catch(console.error);
};

export const addCommentSerie = (
  comment,
  username,
  id,
  serieId,
  episodeId) => (dispatch) => {
  dispatch(pending());
  axios({
    method: 'PUT',
    url: `${api}/serie/comment`,
    data: {
      comment,
      username,
      id,
      serieId,
      episodeId,
    }
  })
    .then((results) => {
      if (results.data.errors) return dispatch(error(results.data));
      dispatch(fetched([results.data]));
    })
    .catch(console.error);
};
