import axios from 'axios';
import api from '../apiURI';

export const GET = "SERIES_GET";
export const PENDING = "SERIES_PENDING";
export const SCROLL = "SERIES_SCROLL";
export const ERROR = "SERIES_ERROR";

export const pending = () => ({
  type: PENDING,
});

export const fetched = (series) => ({
  type: GET,
  payload: series,
});

export const scrolled = (series) => ({
  type: SCROLL,
  payload: series,
});

export const error = (series) => ({
  type: ERROR,
  payload: series,
})

export const getSeries = ({
  title = '',
  yearMin = 1900,
  yearMax = 2017,
  rateMin = 0,
  rateMax = 10,
  genre = '',
  page = Number(0),
  sort = 'year',
  asc = -1,
  scroll = 0,
} = {}) => (dispatch) => {
  dispatch(pending());
  axios.get(
    `${api}/series?title=${title}&yearMin=${yearMin}&yearMax=${yearMax}&rateMin=${rateMin}&rateMax=${rateMax}&genre=${genre}&page=${page}&asc=${asc}&sort=${sort}`,
  )
  .then(({ data: series }) => {
    if (series.errors) return (dispatch(error(series)));
    if (scroll === 1) {
      dispatch(scrolled(series))
    } else {
      dispatch(fetched(series));
    }
  })
  .catch(console.error);
};

export const TenBestSeries = () => (dispatch) => {
  dispatch(pending());
  axios.get(
    `${api}/series/tenBest`,
  )
  .then(({ data: series }) => {
    dispatch(fetched(series));
  })
  .catch(console.error);
};
