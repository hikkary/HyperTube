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

export const getSeries = ({
  title_search = '',
  genres = '',
  yearMin = 1900,
  yearMax = 2017,
  rateMin = 0,
  rateMax = 10,
  sorted = 1,
  filter = 'title',
} = {}) => (dispatch) => {
  dispatch(pending());
  axios.get(
    `${api}/series/?title_search=${title_search}&genres=${genres}&yearMin=${yearMin}&yearMax=${yearMax}&rateMin=${rateMin}&rateMax=${rateMax}&sorted=${sorted}&filter=${filter}`,
  )
  .then(({ data: data }) =>{
    dispatch(display(data));
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
