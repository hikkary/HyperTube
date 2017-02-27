import axios from 'axios';
import fs from 'fs';
import _ from 'lodash';
import { Movie } from '../Schema';

const writeJson = () => {
  global.movies = _.flattenDepth(global.movies, 1)

  global.movies.map((movie) => {
    console.log('Map');
    const newMovie = new Movie({
      id: movie.id,
      imdb_code: movie.imdb_code,
      title: movie.title,
      year: movie.year,
      rating: movie.rating,
      genres: movie.genres,
      summary: movie.summary,
      language: movie.language,
      medium_cover_image: movie.medium_cover_image,
      large_cover_image: movie.large_cover_image,
      provider: 'YTS',
      torrents: movie.torrents,
    });
    newMovie.save()
      .then(console.log);
  });
  // fs.writeFile('film.json', JSON.stringify(global.movies), (err) => {
  //   if(err) console.log(err);
  //   console.log('ok morray');
  // });
};

const recursiveGet = (page) =>{
  // const db = connect();
  console.log('Page',page);
  axios.get('https://yts.ag/api/v2/list_movies.json?limit=50&page=' + Number(page))
  .then((movie) => {
    if (movie.data.data.movies === undefined || page >= 10) {
      console.log('UNDEFINED');
      writeJson();
      return;
    }
    if (page <= 10)
    {
      let { movies } = movie.data.data;
      global.movies.push(movies);
      console.log('length',global.movies.length);
    }
      //
      // fs.writeFile(`/tmp/film ${page}.json`, JSON.stringify(global.movies), (err) => {
      //   if(err) console.log(err);
      //   console.log('ok morray');
      // });
  })
  .then(() => {
    console.log('RELOAD');
    if (page < 10)
      recursiveGet(page + 1);

  })
}

const getYts = (page = 1) => {
  recursiveGet(page)
};

export const get = (req, res) => {
  global.movies = [];
  getYts();
  // getYts(0).then( (ytsMovie) => {
  // console.log(ytsMovie.data.data.movies);

  // ytsMovie.data.movies[0].map( (movie) => {
  // 	console.log(movie)
  // }  );

  // })
  res.send(true);
};

export const read = (req, res) => {
  let movies = fs.readFileSync('/tmp/film 1.json', 'UTF-8');
  movies = JSON.parse(movies);
  // console.log(movies.length);
  console.log(movies);
  res.send('ok');
};

export const post = (req, res) => {

};

export const modify = (req, res) => {

};

export const display = (req, res) => {
  Movie.find()
    .then((results) => {
      res.send(results);
    });
};
