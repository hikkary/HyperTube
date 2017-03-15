import { GET, SCROLL } from '../Actions/movies';
import _ from 'lodash';

export default (state = [], action) => {
  // console.log("STATE", state);
  // console.log("Action", action);
  // console.log("MOVIES", typeof(action.payload));
  // console.log("MOVIES", action.payload);
  switch (action.type) {
    case GET:
      return action.payload;
    case SCROLL:
      return _.flattenDepth([...state, action.payload], 1);
    default: return state;
  }
}
