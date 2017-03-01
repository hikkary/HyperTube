import { ADDED, ERROR } from '../Actions/users';

export default (state = [], action) => {
  switch (action.type) {
    case ADDED:
      return  action.payload;
    case ERROR:
      return  action.payload;
    default: return state;
  }
};
