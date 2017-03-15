import axios from 'axios';
import _ from 'lodash';
import api from '../apiURI';

export const GET = "SEARCH_GET";
export const PENDING = "PENDING";

export const pending = () => ({
  type: PENDING,
});

export const fetched = (all) => ({
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
    console.log('results before arrayyy', result);
    let data = [];
    data.push(result[0].data,result[1].data) // si on recoit plus que 2 objects?
    data = _.flattenDepth(data, 1);
    console.log("DATAAAAAAA",data);
    dispatch(fetched(data))
    console.log(result);
  });
};
