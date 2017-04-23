import findOrCreate from 'findorcreate-promise';
import mongoose from '../mongoose';

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
  lastSeenDate: Date,
});

movie.plugin(findOrCreate);

const Movie = mongoose.model('movies', movie);


export default Movie;
