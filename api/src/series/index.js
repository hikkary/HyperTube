import axios from 'axios';
import debug from 'debug';
import _ from 'lodash';
import Joi from 'joi';
import apiKey from '../../apiKey';
import { Serie } from '../Schema';
import { getSeries } from '../Joi/search';
import mongoose from '../mongoose';

const log = debug('hypertube:api:series');

const writeJson = (allSeries) => {
  allSeries = _.flattenDepth(allSeries, 1);
  allSeries.forEach(serie =>
    axios.get(`http://eztvapi.ml/show/${serie.imdb_id}`)
      .then((content) => {
        // if(content) {
        // console.log('dataaaaaaaaaaaaaa', content.data);
        // }
        axios.get(`http://www.omdbapi.com/?i=${content.data.imdb_id}`)
          .then((response) => {
            console.log('response serie omdb dscsdcdsc', response.data.Genre);
            const genres = response.data.Genre.split(',');
            console.log(genres);
              const newSerie = {
                images: serie.images,
                description: response.data.Plot,
                duration: response.data.Runtime,
                rating: Number(response.data.imdbRating),
                released: response.data.Released,
                cast: response.data.Actors,
                genres,
                directors: response.data.Director,
                writers: response.data.Writer,
                // review: response.data.review,
                imdb_code: serie.imdb_id,
                num_seasons: serie.num_seasons,
                title: serie.title,
                title_search: serie.title.toLowerCase(),
                year: serie.year,
                provider: 'EZTV',
                content : content.data.episodes,
              };
              Serie.findOrCreate({ imdb_code: serie.imdb_id }, newSerie, { upsert: true }).catch((err) => { console.log(err); });
              // newSerie.save()
                // .then(() => {
                  // log(`${serie.title} added !`);
                // });
          });
      })
      .catch(() => {
        console.log('ok')
      })
  );
};

const recursiveEztv = (page, allSeries) => {
  axios.get(`http://eztvapi.ml/shows/${Number(page)}`).then((data) => {
    if (!data.data) {
      writeJson(allSeries);
      return;
    }
    allSeries.push(data.data);
    if (data.data) { recursiveEztv(page + 1, allSeries); }
  });
};

export const scrap = (req, res) => {
  const allSeries = [];
  setInterval(() => { recursiveEztv(1, allSeries) }, 3600000);
  recursiveEztv(1, allSeries);
  res.send(true);
};

export const getInfo = (req, res) => {
  // axios.get(`http://imdb.wemakesites.net/api/${req.body.imdb}?api_key=87ffd3ef-264f-43b0-8ce6-aae18034a202`)
  // .then((data) => {
  //   res.send(data.data);
  // });
};

export const tenBest = (req, res) => {
  Serie.find().sort({ year: -1 })
  .limit(8)
  .then((results) => {
    res.send(results);
  });
};

const RES_PER_PAGE = 30;

export const get = async (req, res) => {
  const { error } = await Joi.validate(req.query, getSeries, { abortEarly: false });
  if (error) return res.send({ status: false, errors: error.details });
  const { yearMin, yearMax, rateMin, rateMax, genre, page, asc, sort, title } = req.query;
  log('titles', title);
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
  console.log('search', searchObj);
  Serie.find(searchObj)
    .skip(page * RES_PER_PAGE)
    .limit(RES_PER_PAGE)
    .sort({ [sort]: asc })
    .exec()
    .then((data) => {
      res.send(data.map(serie => _.pick(serie, [
        'title',
        'rating',
        'year',
        'genres',
        'imdb_code',
        'provider',
        'images',
      ])));
    })
    .catch(() => {
      res.send({ status: false, details: 'An error occurred' });
    });
};
