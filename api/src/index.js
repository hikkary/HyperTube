import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import debug from 'debug';
import * as movies from './movies';
import * as movie from './movie';
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
  .get('/api/movies', movies.get)
  .get('/api/movie/:id', movie.movie)
  .get('/api/movies/scrap', movies.scrap)
  .get('/api/movies/tenBest', movies.tenBest);
  // .post('/api/movies/getGenre', movies.getGenre)
  // .post('/api/movies', movies.post)
  // .put('/api/movies', movies.modify);

seriesRouter
  .get('/api/series', series.get)
  .get('/api/series/scrap', series.scrap)
  .get('/api/series/tenBest', series.tenBest)
  .post('/api/series/getInfo', series.getInfo);

users
  .put('/api/users/login', user.login)
  .post('/api/users/editProfile', user.editProfile)
  .post('/api/users/register', user.createAccount)
  .post('/api/users/facebook_auth', user.facebook)
  .post('/api/users/forgotPassword', user.forgotPassword)
  .post('/api/users/updatePassword', user.updatePassword)
  .get('/api/users/42_auth', user.handleAuthorize42)
  .get('/api/users/connectedUser', user.connectedUser)
  .post('/api/users/getUserInfo', user.getUserInfo);

app
  .use(cors()) // connexion front back
  .use(bodyParser.urlencoded({ extended: false }))
  .use(bodyParser.json())
  .use('/public', express.static(`${__dirname}/../public`))
  .use(movieRouter)
  .use(seriesRouter)
  .use(users)
  .use(stream);

app.listen(8080, () => {
  log('Example app listening on port 8080!');
});
