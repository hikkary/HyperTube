import { GET } from '../Actions/movie';


export default (state = {}, action) => {
  switch (action.type) {
    case GET:
      return action.payload;
    default: return state;
  }
}
