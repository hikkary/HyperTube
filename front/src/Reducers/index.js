import { combineReducers } from 'redux';
import movies from './movies';
import series from './series';
import register from './register';
import login from './login';

export default combineReducers({
  movies,
  series,
  register,
  login,
});
