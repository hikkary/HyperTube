import { GET, SCROLL,ERROR } from '../Actions/movies';
import _ from 'lodash';

export default (state = [], action) => {
  switch (action.type) {
    case GET:
      return action.payload;
    case ERROR:
      return [action.payload];
    case SCROLL:
      return [...state, ...action.payload];
    default: return state;
  }
}
