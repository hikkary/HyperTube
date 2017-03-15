import { GET, SCROLL } from '../Actions/series';
import _ from 'lodash';

export default (state = [], action) => {
  // console.log(state);
  // console.log('action', action.payload);
  switch (action.type) {
    case GET:
      return action.payload;
    case SCROLL:
      return _.flattenDepth([...state, action.payload], 1);
    default: return state;
  }
}
