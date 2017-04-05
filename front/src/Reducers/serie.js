import { GET, ERROR } from '../Actions/serie';

export default (state = {}, action) => {
  switch(action.type) {
  case GET:
    return action.payload;
  case ERROR:
    return { ...state , ...action.payload };
  default: return state;
  }
}
