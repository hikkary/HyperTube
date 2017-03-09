import axios from 'axios';
import fs from 'fs';
import _ from 'lodash';
import mongoose from 'mongoose';
import { Movie } from '../Schema';

const log = require('debug')('hypertube:movies.js');

const writeJson = (allMovies) => {
  mongoose.connection.collections['movies'].drop((err) => {
      console.log('collection dropped');
  });
  allMovies = _.flattenDepth(allMovies, 1);
  // console.log(allMovies);
  allMovies.map((movie) => {
    let rate = -1;
    if (movie.rating) {
      rate = Math.floor(movie.rating);
    }
    const newMovie = new Movie({
      id: movie.id,
      imdb_code: movie.imdb_code,
      title: movie.title,
      title_search: movie.title.toLowerCase(),
      year: movie.year,
      rating: rate,
      genres: movie.genres,
      summary: movie.summary,
      language: movie.language,
      mediumImage: movie.medium_cover_image,
      largeImage: movie.large_cover_image,
      provider: 'YTS',
      torrents: movie.torrents,
    });
    newMovie.save()
  });
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
  getYts();
  res.send(true);
};

export const post = (req, res) => {

};

export const modify = (req, res) => {

};

export const display = (req, res) => {
  const filteredData = {
    title_search: req.query.title_search,
    genres: req.query.genres,
  };
  log(filteredData)

  let data = _.reduce(filteredData, (accu, value, key) => {
    if (value) {
      return { ...accu, [key]: value };
    }
    return accu;
  }, {});

  if (data.title_search)
  {
    log(data)

    data.title_search = { $regex: `${data.title_search}` }
  }

  log(data)
  // const test = {
  //   title: 1,
  // }
  Movie.find(data)
  .sort({ [req.query.filter]: [req.query.sorted] })
  .exec()
    .then((results) => {
      // log(results);
      const yearAndRateRange = results.filter((movie) => {
        if (movie.year >= req.query.yearMin && movie.year <= req.query.yearMax &&
          movie.rating >= req.query.rateMin && movie.rating <= req.query.rateMax) {
          return movie;
        }
      });
      // log(yearAndRateRange);
      // log(results);
      res.send(yearAndRateRange);
    })
    // .catch(log);
};

export const tenBest = (req, res) => {
  console.log('okkkk');
  Movie.find().sort({ rating: -1 })
  .limit(8)
  .then((results) => {
    // console.log(results);
    res.send(results);
  });
};

export const getGenre = (req, res) => {
  console.log('Dans Genre');
  Movie.find({ genres: req.body.genre }).sort({ title: 1 })
  .then((results) => {
    console.log(results);
    res.send(results);
  });
};
