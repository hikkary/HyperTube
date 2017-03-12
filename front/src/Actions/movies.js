import axios from 'axios';
import api from '../apiURI';

export const GET = 'MOVIE_GET';
export const PENDING = 'MOVIE_PENDING';
export const FILTER = 'MOVIE_FILTER';
// export const SEARCH = 'MOVIE_PENDING';

export const pending = () => ({
  type: PENDING,
});

export const display = movies  => ({
  type: GET,
  payload: movies,
});

// export const search = keys => ({
//   type: SEARCH,
//   payload: keys,
// })

// TODO check getMovie call
export const getMovie = ({
  yearMin = 1900,
  title = '',
  yearMax = 2017,
  rateMin = 0,
  rateMax = 10,
  genre = '',
  page = 0,
  sort = 'title',
  asc = 1,
} = {}) => (dispatch) => {
  dispatch(pending());
  axios.get(
    `${api}/movies?title=${title}&yearMin=${yearMin}&yearMax=${yearMax}&rateMin=${rateMin}&rateMax=${rateMax}&genre=${genre}&page=${page}&asc=${asc}&sort=${sort}`,
  )
  .then(({ data: movies }) => {
    console.log("MOVieS  :" ,typeof(movies))
    console.log("MOVieS  :" ,movies)
    dispatch(display(movies));
  })
  .catch(console.error)
};

export const TenBestMovies = () => (dispatch) => {
  dispatch(pending());
  axios.get(
    `${api}/movies/tenBest`,
  )
  .then(({ data: movies }) => {
    dispatch(display(movies));
  })
  .catch(console.error)
};

export const getGenre = (genre) => (dispatch) => {
  dispatch(pending());
  axios({
    method: 'POST',
    url: `${api}/movies/getGenre`,
    data: {
      genre: genre,
    }
  })
  .then(({ data: movies }) => {
    console.log('genresssss', movies);
    dispatch(display(movies));
  })
  .catch(console.error)
};
