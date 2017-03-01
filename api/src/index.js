import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import * as movie from './movie';
import './mongoose';
import * as series from './series';

const app = express();
const movieRouter = express.Router('/api/movie');
const seriesRouter = express.Router('/api/series');
const user = express.Router('/api/user');
const stream = express.Router('/api/stream');

movieRouter
  .get('/api/movie', movie.get)
  .get('/api/movie/display', movie.display)
  .get('/api/movie/read', movie.read)
  .post('/api/movie', movie.post)
  .put('/api/movie', movie.modify);

seriesRouter
  .get('/api/series', series.getSeries)
  .get('/api/series/display', series.display)
app
  .use(cors())
  .use(bodyParser.urlencoded({ extended: false }))
  .use(bodyParser.json())
  .use(movieRouter)
  .use(seriesRouter)
  .use(user)
  .use(stream);

app.listen(8080, () => {
  console.log('Example app listening on port 8080!'); // eslint-disable-line no-console
});
