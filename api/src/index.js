import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import debug from 'debug';
import * as movies from './movies';
import * as movie from './movie';
import * as series from './series';
import * as serie from './serie';
import * as users from './users';
import * as torrent from './torrent';
import './mongoose';

const log = debug('hypertube:index.js');

const app = express();
const moviesRouter = express.Router('/api/movie');
const seriesRouter = express.Router('/api/series');
const usersRouter = express.Router('/api/users');
const stream = express.Router('/api/stream');

moviesRouter
  .get('/api/movies', movies.get)
  .get('/api/movie/:id', movie.movie)
  .get('/api/movies/scrap', movies.scrap)
  .get('/api/movies/tenBest', movies.tenBest);
  // .post('/api/movies/getGenre', movies.getGenre)
  // .post('/api/movies', movies.post)
  // .put('/api/movies', movies.modify);

seriesRouter
  .get('/api/series', series.get)
  .get('/api/serie/:id', serie.serie)
  .get('/api/series/scrap', series.scrap)
  .get('/api/series/tenBest', series.tenBest)
  .post('/api/series/getInfo', series.getInfo);

usersRouter
  .put('/api/users/login', users.login)
  .post('/api/users/editProfile', users.editProfile)
  .post('/api/users/register', users.createAccount)
  .post('/api/users/facebook_auth', users.facebook)
  .post('/api/users/forgotPassword', users.forgotPassword)
  .post('/api/users/updatePassword', users.updatePassword)
  .get('/api/users/42_auth', users.handleAuthorize42)
  .get('/api/users/connectedUser', users.connectedUser)
  .post('/api/users/getUserInfo', users.getUserInfo);

stream
  .get('/api/stream/:hash/:id', torrent.torrent);

app
  .use(cors()) // connexion front back
  .use(bodyParser.urlencoded({ extended: false }))
  .use(bodyParser.json())
  .use('/public', express.static(`${__dirname}/../public`))
  .use(moviesRouter)
  .use(seriesRouter)
  .use(usersRouter)
  .use(stream);

app.listen(8080, () => {
  log('Example app listening on port 8080!');
});
