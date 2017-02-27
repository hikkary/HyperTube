import { GET } from '../Actions/movies';
// ANCIEN IMPORT import { GET } from '../Actions'; 


export default (state = [], action) => {
  console.log(state);
  console.log("STATE", state);
  console.log("Action", action);
  console.log("MOVIES", typeof(action.payload));
  console.log("MOVIES", action.payload);
  switch (action.type) {
    case GET:
      return action.payload;
      // return action.payload;
    default: return state;
  }
}
