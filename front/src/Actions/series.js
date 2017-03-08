import axios from 'axios';
import api from '../apiURI';

export const GET = "SERIES_GET";
export const PENDING = "SERIES_PENDING";

export const pending = () => ({
  type: PENDING,
});

export const display = (series) => ({
  type: GET,
  payload: series,
});

export const getSerie = () => (dispatch) => {
  dispatch(pending());
  axios.get(
    `${api}/series/display`,
  )
  .then((data) =>{
    dispatch(display(data.data));
    // console.log(data.data);
  });
};

export const TenBestSeries = () => (dispatch) => {
  dispatch(pending());
  axios.get(
    `${api}/series/tenBest`,
  )
  .then(({ data: series }) => {
    dispatch(display(series));
  })
  .catch(console.error)
};
