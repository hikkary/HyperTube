import { ADDED, ERROR, REFRESH } from '../Actions/register';

export default (state = [], action) => {
  switch (action.type) {
    case ADDED:
      return  action.payload;
    case ERROR:
      return  action.payload;
    case REFRESH:
      return [];
    default: return state;
  }
};
