import { GET } from '../Actions/movies';

// const search = (action) =>{
    // action.payload.Map;
// }

export default (state = [], action) => {
  // console.log("STATE", state);
  // console.log("Action", action);
  // console.log("MOVIES", typeof(action.payload));
  // console.log("MOVIES", action.payload);
  switch (action.type) {
    case GET:
      return action.payload;
    // case SEARCH:
      // return search(action);
      // return action.payload;
    default: return state;
  }
}
