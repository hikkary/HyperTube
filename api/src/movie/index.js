import axios from 'axios';
import fs from 'fs';
import _ from 'lodash';
import mongoose from 'mongoose';
import { Movie } from '../Schema';

const writeJson = () => {
  mongoose.connection.collections['movies'].drop( function(err) {
      console.log('collection dropped');
  });
  global.movies = _.flattenDepth(global.movies, 1)
  // console.log(global.movies);
  global.movies.map((movie) => {
    // console.log('Map');
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
  });
  // fs.writeFile('film.json', JSON.stringify(global.movies), (err) => {
  //   if(err) console.log(err);
  //   console.log('ok morray');
  // });
};

const recursiveGet = (page) => {
  console.log('Page',page);
  axios.get(`https://yts.ag/api/v2/list_movies.json?limit=50&page=${Number(page)}`)
  .then((movie) => {
    if (movie.data.data.movies === undefined) {
      console.log('UNDEFINED');
      writeJson();
      return;
    }
    const { movies } = movie.data.data;
    global.movies.push(movies);
    recursiveGet(page + 1);
  });
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
