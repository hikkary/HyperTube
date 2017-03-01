import mongoose from '../mongoose';

const serie = mongoose.Schema({
  id: Number,
  images: Object,
  imdb_id: String,
  num_seasons: Number,
  title: String,
  year: Number,
  provider: String,
});

const Serie = mongoose.model('Series', serie);

export default Serie;
