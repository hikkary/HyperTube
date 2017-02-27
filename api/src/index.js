import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import * as movie from '../movie/index';


const app = express();
const movieRouter = express.Router('/api/movie');
const user = express.Router('/api/user');
const stream = express.Router('/api/stream');

movieRouter
.get('/api/movie', movie.get)
.get('/api/movie/read', movie.read)
.get('/api/movie/db', movie.toDatabase)
.post('/api/movie', movie.post)
.put('/api/movie', movie.modify);

app
.use(cors())
.use(bodyParser.urlencoded({ extended: false }))
.use(bodyParser.json())
.use(movieRouter)
.use(user)
.use(stream);

app.listen(8080, () => {
  console.log('Example app listening on port 8080!'); // eslint-disable-line no-console
});
