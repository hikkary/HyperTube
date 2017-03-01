import { combineReducers } from 'redux';
import movies from './movies';
import series from './series';
// import users from './users';

export default combineReducers({
  movies,
  series
  // users
});
