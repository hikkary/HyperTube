import { combineReducers } from 'redux';
import movies from './movies';
import series from './series';
import translation from './translation';
import search from './search';
import movie from './movie';
import serie from './serie';
import user from './user';

export default combineReducers({
  movies,
  series,
  translation,
  search,
  movie,
  serie,
  user,
});
