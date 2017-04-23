import axios from 'axios';
import _ from 'lodash';
import Joi from 'joi';
import { Movie } from '../Schema';
import { getMovies } from '../Joi/search';

const log = require('debug')('hypertube:movies.js');

const movieToDatabase = (allMovies) => {
  allMovies = _.flattenDepth(allMovies, 1);
  allMovies.map((movie) => {
    let rate = -1;
    if (movie.rating) {
      rate = Math.floor(movie.rating);
    }
    let sum = 0;
    if (movie.torrents) {
      const seeds = movie.torrents.map((data) => {
        if (data.seeds) return data.seeds;
      });
      sum = seeds.reduce((a = 0, b = 0) => a + b, 0);
    }
    const newMovie = {
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
      seeds: sum,
    };
	log(movie.title);
    Movie.findOrCreate({ id: movie.id }, newMovie, { upsert: true }).catch((err) => { console.log(err); });
  });
};

const recursiveScrap = (page, allMovies) => {
  axios.get(`https://yts.ag/api/v2/list_movies.json?limit=50&page=${Number(page)}`)
  .then((movie) => {
    if (movie.data.data.movies === undefined) {
      movieToDatabase(allMovies);
      return;
    }
    const { movies } = movie.data.data;
    allMovies.push(movies);
    recursiveScrap(page + 1, allMovies);
  });
};

export const scrap = (req, res) => {
  setInterval(() => { recursiveScrap(0, []); }, 3600000);
  recursiveScrap(0, []);
  res.send(true);
};

const RES_PER_PAGE = 30;

export const get = async (req, res) => {
  const { error } = await Joi.validate(req.query, getMovies, { abortEarly: false });
  if (error) return res.send({ status: false, errors: error.details });
  const { yearMin, yearMax, rateMin, rateMax, genre, page, asc, sort, title } = req.query;
  const searchObj = {
    year: { $gt: (yearMin || 1900) - 1, $lt: (Number(yearMax) || Number(2017)) + Number(1) },
    rating: { $gt: (rateMin || 0) - 1, $lt: (Number(rateMax) || Number(10)) + Number(1) },
  };
  if (genre) {
    searchObj.genres = genre;
  }
  if (title) {
    searchObj.title = new RegExp(`${title}`, 'gi');
  }
  Movie.find(searchObj)
    .skip(page * RES_PER_PAGE)
    .limit(RES_PER_PAGE)
    .sort({ [sort]: asc })
    .exec()
    .then((data) => {
      res.send(data.map(movie => _.pick(movie, [
        'title',
        'rating',
        'year',
        'id',
        'seenBy',
        'provider',
        'largeImage',
      ])));
    })
    .catch(() => {
      res.send({ status: false, details: 'An error occurred' });
    });
};

export const tenBest = (req, res) => {
  Movie.find().sort({ seeds: -1 })
  .limit(20)
  .then((results) => {
    res.send(results);
  });
};

export const getGenre = (req, res) => {
  Movie.find({ genres: req.body.genre }).sort({ title: 1 })
  .then((results) => {
    res.send(results);
  });
};
