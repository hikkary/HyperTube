import axios from 'axios';
import fs from 'fs';
import _ from 'lodash';
import Joi from 'joi';
import mongoose from 'mongoose';
import { Movie } from '../Schema';
import { getMovies } from '../Schema/search';

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
  console.log('Page', page);
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
};

export const scrap = (req, res) => {
  recursiveGet(0, []);
  res.send(true);
};

const RES_PER_PAGE = 30;

export const get = async (req, res) => {
  const { error } = await Joi.validate(req.query, getMovies, { abortEarly: false });

  if (error) return res.send({ status: false, details: error.details });
  const { yearMin, yearMax, rateMin, rateMax, genre, page, asc, sort, title } = req.query;
  const searchObj = {
    year: { $gt: (yearMin || 1900) - 1, $lt: (yearMax || 2017) + 1 },
    rating: { $gt: (rateMin || 0) - 1, $lt: (rateMax || 10) + 1 },
  };
  if (genre) {
    searchObj.genre = genre;
  }
  if (title) {
    searchObj.title = new RegExp(`/${title}/`, 'gi');
  }
  log(searchObj);
  Movie.find(searchObj)
    .skip(page * RES_PER_PAGE)
    .limit(RES_PER_PAGE)
    .sort(`${
      // select asc or desc
      (asc || 1) ? '+' : '-'
    }${
      // select key
      (sort || 'title')
    }`)
    .exec()
    .then((data) => {
      res.send(data.map(movie => _.pick(movie, [
        'title',
        'rating',
        'year',
        'largeImage',
      ])));
    })
    .catch(() => {
      res.send({ status: false, details: 'An error occurred' });
    });
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
