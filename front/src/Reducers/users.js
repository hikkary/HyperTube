import { ADDED } from '../Actions/users';

export default (state = [], action) => {
  switch (action.type) {
    case ADDED:
      return  action.payload;
    default: return state;
  }
};
