import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import debug from 'debug';
import * as movie from './movies';
import * as series from './series';
import * as user from './users/user';
import './mongoose';

const log = debug('hypertube:index.js');

const app = express();
const movieRouter = express.Router('/api/movie');
const seriesRouter = express.Router('/api/series');
const users = express.Router('/api/users');
const stream = express.Router('/api/stream');

movieRouter
  .get('/api/movies', movie.display)
  .get('/api/movies/scrap', movie.get)
  .get('/api/movies/tenBest', movie.tenBest)
  .post('/api/movies/getGenre', movie.getGenre)
  .post('/api/movies', movie.post)
  .put('/api/movies', movie.modify);

seriesRouter
  .get('/api/series', series.display)
  .get('/api/series/scrap', series.getSeries)
  .get('/api/series/tenBest', series.tenBest)
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
