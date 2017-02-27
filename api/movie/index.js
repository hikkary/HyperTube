import axios from 'axios';
import fs from 'fs';
import _ from 'lodash';
import mongoose from 'mongoose';
import connect from '../mongoose';

const writeJson = () => {
  let movieModel = null;
  const db = connect();
  global.movies = _.flattenDepth(global.movies, 1)
  console.log(global.movies.length);
  db.once('open', () => {
    console.log('Database');
    const ytsMovie = mongoose.Schema({
      id: Number,
      imdb_code : String,
      title : String,
      year : Number,
      rating: Number,
      genres: Object,
      summary: String,
      language: String,
      medium_cover_image: String,
      large_cover_image: String,
      provider: String,
      torrents: Object,
    })
    console.log('Datave 2');
    if (movieModel === null){
      movieModel = mongoose.model('movieModel', ytsMovie);
    }

    global.movies.map((movie) => {
      console.log('Map');
      movieModel.create({
        id: movie.id,
        imdb_code : movie.imdb_code,
        title : movie.title,
        year : movie.year,
        rating: movie.rating,
        genres: movie.genres,
        summary: movie.summary,
        language: movie.language,
        medium_cover_image: movie.medium_cover_image,
        large_cover_image: movie.large_cover_image,
        provider: 'YTS',
        torrents: movie.torrents,
      }, (err, doc) => {
        // console.log(doc);
        console.log('YOUPI');
      });
    })
  })
  // fs.writeFile('film.json', JSON.stringify(global.movies), (err) => {
  //   if(err) console.log(err);
  //   console.log('ok morray');
  // });

}

const recursiveGet = (page) =>{
  // const db = connect();
  console.log("Page",page);
  axios.get('https://yts.ag/api/v2/list_movies.json?limit=50&page=' + Number(page))
  .then((movie) => {
    if (movie.data.data.movies === undefined || page >= 10) {
      console.log("UNDEFINED");
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
  res.send(true)
};

export const read = (req, res) => {
  let movies = fs.readFileSync("/tmp/film 1.json", "UTF-8");
  movies = JSON.parse(movies);
  // console.log(movies.length);
  console.log(movies);
  res.send('ok')
}


export const toDatabase = (req, res) => {
  // console.log("connect",connect);
    const db = connect();

    db.once('open',() => {
      const ytsMovie = mongoose.Schema({
        id: Number,
        imdb_code : String,
        title : String,
        year : Number,
        rating: Number,
        genres: Object,
        summary: String,
        language: String,
        medium_cover_image: String,
        large_cover_image: String,
        torrents: Object,
      })
      const movieModel = mongoose.model('movieModel', ytsMovie);
      movieModel.create({

      }, (err, doc) => {
        console.log(doc);
        console.log('YOUPI');
      }
    )
    })
    // const db = connect;
    // console.log(db);
    // db.once('open', () => {
    //   console.log('Tout va bien');
    // })
    res.send('ok');
};



export const post = (req, res) => {

};

export const modify = (req, res) => {

};
