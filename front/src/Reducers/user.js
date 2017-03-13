import { ADDED, ERROR, REFRESH, REGISTER } from '../Actions/user';

export default (state = [], action) => {
  switch (action.type) {
    case ADDED:
      return  action.payload;
    case ERROR:
      return  action.payload;
    case REGISTER:
      return  action.payload;
    case REFRESH:
      return [];
    default: return state;
  }
};
