import { combineReducers } from 'redux';
import movies from './movies';
import series from './series';
import register from './register';
import login from './login';
import translation from './translation';
import search from './search';

export default combineReducers({
  movies,
  series,
  register,
  login,
  translation,
  search,
});
