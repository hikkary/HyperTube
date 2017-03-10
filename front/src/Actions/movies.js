import axios from 'axios';
import api from '../apiURI';

export const GET = 'MOVIE_GET';
export const PENDING = 'MOVIE_PENDING';
export const FILTER = 'MOVIE_FILTER';
// export const SEARCH = 'MOVIE_PENDING';

export const pending = () => ({
  type: PENDING,
});

export const display = movies => ({
  type: GET,
  payload: movies,
});

// export const search = keys => ({
//   type: SEARCH,
//   payload: keys,
// })
export const getMovie = ({
  id = '',
  title_search = '',
  yearMin = 1900,
  yearMax = 2017,
  rateMin = 0,
  rateMax = 10,
  genres = '',
  page = '',
  filter = 'title',
  sorted = 1,
} = {}) => (dispatch) => {
  dispatch(pending());
  axios.get(
    `${api}/movies?id=${id}&title_search=${title_search}&yearMin=${yearMin}&yearMax=${yearMax}&rateMin=${rateMin}&rateMax=${rateMax}&genres=${genres}&page=${page}&sorted=${sorted}&filter=${filter}`,
  )
  .then(({ data: movies }) => {
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
