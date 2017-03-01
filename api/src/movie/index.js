import axios from 'axios';
import fs from 'fs';
import _ from 'lodash';
import mongoose from 'mongoose';
import { Movie } from '../Schema';

const writeJson = (allMovies) => {
  mongoose.connection.collections['movies'].drop((err) => {
      console.log('collection dropped');
  });
  allMovies = _.flattenDepth(allMovies, 1)
  // console.log(allMovies);
  allMovies.map((movie) => {
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

const recursiveGet = (page, allMovies) => {
  console.log('Page',page);
  axios.get(`https://yts.ag/api/v2/list_movies.json?limit=50&page=${Number(page)}`)
  .then((movie) => {
    if (movie.data.data.movies === undefined) {
      console.log('UNDEFINED');
      writeJson(allMovies);
      return;
    }
    const { movies } = movie.data.data;
    allMovies.push(movies);
    recursiveGet(page + 1, allMovies);
  });
}

const getYts = (page = 1, allMovies = []) => {
  recursiveGet(page, allMovies)
};

export const get = (req, res) => {
  // global.movies = [];
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
