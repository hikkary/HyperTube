import axios from 'axios';
import _ from 'lodash';
import api from '../apiURI';

export const GET = "SEARCH_GET";
export const PENDING = "SEARCH_PENDING";

export const pending = () => ({
  type: PENDING,
});

export const display = (all) => ({
  type: GET,
  payload: all,
});

export const getAll = ({
  title_search = '',
  genres = '',
  page = '',
  yearMin = 1900,
  yearMax = 2017,
  rateMin = 0,
  rateMax = 10,
  sorted = 1,
  filter = 'title',
} = {}) => (dispatch) => {
  dispatch(pending());
Promise.all([
  axios.get(
    `${api}/movies?title_search=${title_search}&yearMin=${yearMin}&yearMax=${yearMax}&rateMin=${rateMin}&rateMax=${rateMax}&genres=${genres}&page=${page}&sorted=${sorted}&filter=${filter}`,
  ),
  axios.get(
    `${api}/series/?title_search=${title_search}&genres=${genres}&yearMin=${yearMin}&yearMax=${yearMax}&rateMin=${rateMin}&rateMax=${rateMax}&sorted=${sorted}&filter=${filter}`,
  )])
  .then((result) => {
    const data = _.flattenDepth(result, 1);
    dispatch(display(data))
    console.log(result);
  })



  // .then(({ data: data }) =>{
  //   dispatch(display(data));
  //   // console.log(data.data);
  // });
};
