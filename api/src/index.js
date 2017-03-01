import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import * as movie from './movie';
import './mongoose';
import * as series from './series';
import * as parser from './users/parser';
import * as user from './users/user';

const app = express();
const movieRouter = express.Router('/api/movie');
const seriesRouter = express.Router('/api/series');
const users = express.Router('/api/users');
const stream = express.Router('/api/stream');

movieRouter
  .get('/api/movie', movie.get)
  .get('/api/movie/display', movie.display)
  .post('/api/movie', movie.post)
  .put('/api/movie', movie.modify);

seriesRouter
  .get('/api/series', series.getSeries)
  .get('/api/series/getInfo', series.getInfo)
  .get('/api/series/display', series.display);

users
  .post('/api/users', parser.emptyCheck, parser.username, parser.firstname, parser.lastname, parser.email, user.createAccount);

app
  .use(cors())
  .use(bodyParser.urlencoded({ extended: false }))
  .use(bodyParser.json())
  .use(movieRouter)
  .use(seriesRouter)
  .use(users)
  .use(stream);

app.listen(8080, () => {
  console.log('Example app listening on port 8080!'); // eslint-disable-line no-console
});
