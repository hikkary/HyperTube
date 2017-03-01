import mongoose from '../mongoose';

const user = mongoose.Schema({
  username: String,
  firstname: String,
  lastname: String,
  email: String,
  password: String,
  picture: String,
  key: Number,
  });

const User = mongoose.model('users', user);

export default User;
