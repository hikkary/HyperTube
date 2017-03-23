import mongoose from 'mongoose';
import secret from '../secret';

let mon = null;

const connect = () => {
  mongoose.Promise = global.Promise;
  mongoose.connect(secret);
  const db = mongoose.connection;
  db.once('open', () => console.log('connection established'));
  db.on('error', () => console.error('connection error'));
  mon = mongoose;
  return db;
};

if (!mon) connect();

export default mon;
