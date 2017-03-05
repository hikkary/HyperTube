import findOrCreate from 'findorcreate-promise';
import mongoose from '../mongoose';

const user = mongoose.Schema({
  auth_id: String,
  username: String,
  firstname: String,
  lastname: String,
  email: String,
  password: String,
  picture: String,
  key: Number,
  provider: String,
});


user.plugin(findOrCreate);

const User = mongoose.model('users', user);

export default User;
