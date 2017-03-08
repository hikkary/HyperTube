import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import debug from 'debug';
import * as movie from './movie';
import './mongoose';
import * as series from './series';
import * as user from './users/user';

const log = debug('hypertube:index.js');

const app = express();
const movieRouter = express.Router('/api/movie');
const seriesRouter = express.Router('/api/series');
const users = express.Router('/api/users');
const stream = express.Router('/api/stream');

movieRouter
  .get('/api/movie', movie.get)
  .get('/api/movie/display', movie.display)
  .get('/api/movie/tenBest', movie.tenBest)
  .post('/api/movie/getGenre', movie.getGenre)
  .post('/api/movie', movie.post)
  .put('/api/movie', movie.modify);

seriesRouter
  .get('/api/series', series.getSeries)
  .get('/api/series/tenBest', series.tenBest)
  .get('/api/series/display', series.display)
  .post('/api/series/getInfo', series.getInfo);

users
  .put('/api/users/login', user.login)
  .post('/api/users/register', user.createAccount)
  .post('/api/users/facebook_auth', user.facebook)
  .get('/api/users/42_auth', user.handleAuthorize42);
app
  .use(cors()) // connexion front back
  .use('/public', express.static(`${__dirname}/public`))
  .use(bodyParser.urlencoded({ extended: false }))
  .use(bodyParser.json())
  .use(movieRouter)
  .use(seriesRouter)
  .use(users)
  .use(stream);

app.listen(8080, () => {
  log('Example app listening on port 8080!');
});
