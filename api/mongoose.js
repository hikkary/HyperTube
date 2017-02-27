import mongoose from 'mongoose';
import secret from './secret';

const connect = () => {
  console.log("secret",secret);
  mongoose.connect(secret);
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));

  return db;
}

export default connect;
