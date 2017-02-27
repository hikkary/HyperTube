import mongoose from '../mongoose';

const movie = mongoose.Schema({
  id: Number,
  imdb_code: String,
  title: String,
  year: Number,
  rating: Number,
  genres: Object,
  summary: String,
  language: String,
  medium_cover_image: String,
  large_cover_image: String,
  provider: String,
  torrents: Object,
});

const Movie = mongoose.model('Movies', movie);

export default Movie;
