import mongoose from '../mongoose';

const serie = mongoose.Schema({
  id: Number,
  images: Object,
  imdb_code: String,
  num_seasons: Number,
  seenBy: Array,
  title: String,
  year: Number,
  provider: String,
});

const Serie = mongoose.model('series', serie);

export default Serie;
