import axios from 'axios';
import debug from 'debug';
// import fs from 'fs';
import _ from 'lodash';
import apiKey from '../../apiKey';
import { Serie } from '../Schema';
import mongoose from '../mongoose';

const log = debug('hypertube:api:series');

const writeJson = (allSeries) => {
  allSeries = _.flattenDepth(allSeries, 1);
  mongoose.connection.collections.series.drop((err) => {
    log('collection dropped');
  });
  allSeries.forEach(serie =>
    axios.get(`http://imdb.wemakesites.net/api/${serie.imdb_id}?api_key=87ffd3ef-264f-43b0-8ce6-aae18034a202`)
      // arg: response.data.data
      .then(({ data: { data } }) => {
        if (data) {
          let rate = '-';
          if (data.review && data.review.rating !== null) { rate = Number(data.review.rating.split('/')[0]); }
          else {
            rate = -1;
          }
          console.log('rate', rate);
          const newSerie = new Serie({
            images: serie.images,
            description: data.description,
            duration: data.duration,
            rating: rate,
            released: data.released,
            cast: data.cast,
            genres: data.genres,
            directors: data.directors,
            writers: data.writers,
            review: data.review,
            imdb_code: serie.imdb_id,
            num_seasons: serie.num_seasons,
            title: serie.title,
            title_search: serie.title.toLowerCase(),
            year: serie.year,
            provider: 'EZTV',
          });
          newSerie.save()
          .then(() => {
            log(`${serie.title} added !`);
          });
        }
      }),
    );
};

const recursiveEztv = (page, allSeries) => {
  // console.log(p'http://eztvapi.ml/shows/${page}');
  console.log(page);
  axios.get(`http://eztvapi.ml/shows/${page}`).then((data) => {
    // console.log("DATA", data.data[0]);
    if (!data.data) {
      writeJson(allSeries);
      return;
    }
    allSeries.push(data.data);
    if (data.data) { recursiveEztv(page + 1, allSeries); }
  });
};

export const getSeries = (req, res) => {
  const allSeries = [];
  recursiveEztv(1, allSeries);
  res.send(true);
};

export const getInfo = (req, res) => {
  log('coucou');
  axios.get(`http://imdb.wemakesites.net/api/${req.body.imdb}?api_key=87ffd3ef-264f-43b0-8ce6-aae18034a202`)
  .then((data) => {
    res.send(data.data);
  });
};

export const tenBest = (req, res) => {
  Serie.find().sort({ rating: -1 })
  .limit(8)
  .then((results) => {
    console.log(results);
    res.send(results);
  });
};

export const display = (req, res) => {
  const filteredData = {
    title_search: req.query.title_search,
    genres: req.query.genres,
  };

  const data = _.reduce(filteredData, (accu, value, key) => {
    if (value) {
      return { ...accu, [key]: value }
    }
    return accu;
  }, {})

  if (data.title_search)
  {
    log(data)

    data.title_search = { $regex: `${data.title_search}` }
  }

  log(data);
  Serie.find(data)
  .sort({ [req.query.filter]: [req.query.sorted] })
  .then((results) => {
    const yearAndRateRange = results.filter((serie) => {
      if (serie.year >= req.query.yearMin && serie.year <= req.query.yearMax &&
        serie.rating >= req.query.rateMin && serie.rating <= req.query.rateMax) {
        return serie;
      }
    },
  )
  log(yearAndRateRange);

    res.send(yearAndRateRange);
  });
};
