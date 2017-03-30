import mongoose from '../mongoose';
import findOrCreate from 'findorcreate-promise';

const movie = mongoose.Schema({
  id: Number,
  imdb_code: String,
  title: String,
  title_search: String,
  year: Number,
  rating: Number,
  summary: String,
  description: String,
  duration: String,
  released: String,
  cast: Array,
  genres: Array,
  directors: Array,
  writers: Array,
  seeds: Number,
  review: {
    type: Object,
    default: {
      rating: {
        type: String,
        default: '-',
      },
      text: {
        type: String,
        default: '',
      },
    },
  },
  language: String,
  seenBy: Array,
  mediumImage: String,
  largeImage: String,
  provider: String,
  torrents: Object,
  path: Object,
  comments: Array,
});

movie.plugin(findOrCreate);

const Movie = mongoose.model('movies', movie);


export default Movie;
