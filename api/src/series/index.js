import axios from 'axios';
// import fs from 'fs';
import _ from 'lodash';
import apiKey from '../../apiKey';
import { Serie } from '../Schema';
import mongoose from '../mongoose';

const writeJson = () => {
  let imdb = [];
  global.series = _.flattenDepth(global.series, 1);
  mongoose.connection.collections['series'].drop( function(err) {
      console.log('collection dropped');
  });
  global.series.map((serie) => {
  imdb.push(serie.imdb_id);
      const newSerie = new Serie({
        id: serie.id,
        images: serie.images,
        // description: data.data.description,
        // duration: data.data.duration,
        // released: data.data.released,
        // cast: data.data.cast,
        // genres: data.data.genres,
        // directors: data.data.directors,
        // writers: data.data.writers,
        // review: data.data.review,
        imdb_code: serie.imdb_id,
        num_seasons: serie.num_seasons,
        title: serie.title,
        year: serie.year,
        provider: 'EZTV',
      });
    newSerie.save()
      .then();
  });
};

const recursiveEztv = (page) => {
  console.log('ok entered');
  // console.log(p'http://eztvapi.ml/shows/${page}');
  console.log(page);
  axios.get(`http://eztvapi.ml/shows/${page}`).then((data) => {
    // console.log("DATA", data.data[0]);
    console.log("length", data.data.length);
    if(!data.data)
    {
      writeJson();
      return
    }

    global.series.push(data.data);
    if(data.data)
      recursiveEztv(page + 1);
    // console.log('globallll', global.series);
  });
}

export const getSeries = (req, res) => {
  global.series = [];
  recursiveEztv(1);
  res.send(true);
}

export const getInfo = (req, res) => {
  axios.get('http://imdb.wemakesites.net/api/tt0944947?api_key=87ffd3ef-264f-43b0-8ce6-aae18034a202')
  .then((data) => {
    console.log(data)
  }
  )
  res.send(true);
}


export const display = (req, res) => {
  Serie.find()
  .then((results) => {
    res.send(results);
  });
};
