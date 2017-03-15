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
  title = '',
  yearMin = 1900,
  yearMax = 2017,
  rateMin = 0,
  rateMax = 10,
  genre = '',
  page = Number(0),
  sort = 'title',
  asc = 1,
  scroll = 0,
} = {}) => (dispatch) => {
  dispatch(pending());
Promise.all([
  axios.get(
    `${api}/movies?title=${title}&yearMin=${yearMin}&yearMax=${yearMax}&rateMin=${rateMin}&rateMax=${rateMax}&genre=${genre}&page=${page}&asc=${asc}&sort=${sort}`,
  ),
  axios.get(
    `${api}/series?title=${title}&yearMin=${yearMin}&yearMax=${yearMax}&rateMin=${rateMin}&rateMax=${rateMax}&genre=${genre}&page=${page}&asc=${asc}&sort=${sort}`,
  )])
  .then((result) => {
    // console.log('results before arrayyy', result);
    let data = [];
    data.push(result[0].data,result[1].data) // 2 params in promise all func sent
    data = _.flattenDepth(data, 1);
    // console.log("DATAAAAAAA",data);
    dispatch(fetched(data))
    // console.log(result);
  });
};
