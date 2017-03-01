import axios from 'axios';
// import fs from 'fs';
import _ from 'lodash';
import { Serie } from '../Schema';

const writeJson = () => {
  global.series = _.flattenDepth(global.series, 1);
  // console.log('dffdf', global.series);
  global.series.map((serie) => {
    console.log('serie', serie);
    const newSerie = new Serie({
      id: serie.id,
      images: serie.images,
      imdb_id: serie.imbd_id,
      num_seasons: serie.num_seasons,
      title: serie.title,
      year: serie.year,
      provider: 'EZTV',
    });
  // console.log('newserie', newSerie);
    newSerie.save()
      .then();
  });
};

const recursiveEztv = () => {
  console.log('ok entered');
  axios.get('http://eztvapi.ml/shows/1').then((data) => {
    global.series.push(data.data);
    // console.log('globallll', global.series);
    writeJson();
  });
}

export const getSeries = (req, res) => {
  global.series = [];
  recursiveEztv();
  res.send(true);
}

export const display = (req, res) => {
  Serie.find()
  .then((results) => {
    res.send(results);
  });
};
