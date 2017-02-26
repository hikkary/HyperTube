import axios from 'axios';
import fs from 'fs';

const writeJson = (newAllMovie) => {
  fs.writeFile('film.json', JSON.stringify(newAllMovie), (err) => {
    if(err) console.log(err);
    console.log('ok morray');
  });
}

const recursiveGet = (page, allMovie) =>{
  console.log("Page",page);
  axios.get('https://yts.ag/api/v2/list_movies.json?limit=50&page=' + Number(page))
  .then((movie) => {
    if (movie === undefined || page === 10) {
      console.log("UNDEFINED SA MERE");
      writeJson(allMovie)
      return;
    }
    const { movies } = movie.data.data;
    global.movies.push(movies)
    global.movies.map( (t) =>{
      console.log(t.title)
    }
    )
    fs.writeFile('film.json', JSON.stringify(global.movies), (err) => {
      if(err) console.log(err);
      console.log('ok morray');
    })
  })
  .then(() => {
    console.log("ESH");
    recursiveGet(page + 1, null)
  })
}

const getYts = (page = 1) => {
  let allMovie = recursiveGet(page, {})
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
  // res.send(true)
};

export const post = (req, res) => {

};

export const modify = (req, res) => {

};
