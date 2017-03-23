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

export const getEpisode = ({
  id, serieId
} = {}) => (dispatch) => {
  console.log('serie id action' , serieId);
  dispatch(pending());
  axios.get(
    `${api}/serie/${serieId}/${id}`,
  )
  .then(({ data: serie }) => {
    dispatch(fetched(...serie.details));
  })
  .catch(console.error)
};

export const addCommentSerie = (
  comment,
  username,
  id,
  serie_id) => (dispatch) => {
  dispatch(pending());
  axios({
    method: 'PUT',
    url: `${api}/serie/comment`,
    data: {
      comment,
      username,
      id,
      serie_id,
    }
  })
    .then((results) => {
      console.log('results axios', results);
      dispatch(fetched(results.data));
    })
    .catch(console.error);
};
