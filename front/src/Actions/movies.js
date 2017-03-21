import axios from 'axios';
import api from '../apiURI';

export const GET = 'MOVIES_GET';
export const PENDING = 'PENDING';
export const FILTER = 'MOVIES_FILTER';
export const SCROLL = 'MOVIES_SCROLL';

export const pending = () => ({
  type: PENDING,
});

export const fetched = movies => ({
  type: GET,
  payload: movies,
});

export const scrolled = movies => ({
  type: SCROLL,
  payload: movies,
}) // return directement ({})

// TODO check getMovie call
export const getMovie = ({
  yearMin = 1900,
  title = '',
  yearMax = 2017,
  rateMin = 0,
  rateMax = 10,
  genre = '',
  page = 0,
  scroll = 0,
  sort = 'seeds',
  asc = -1,
} = {}) => (dispatch) => {
  dispatch(pending());
  axios.get(
    `${api}/movies?title=${title}&yearMin=${yearMin}&yearMax=${yearMax}&rateMin=${rateMin}&rateMax=${rateMax}&genre=${genre}&page=${page}&asc=${asc}&sort=${sort}`,
  )
  .then(({ data: movies }) => {
    if(scroll === 1)dispatch(scrolled(movies))
    else dispatch(fetched(movies))
  })
  .catch(console.error);
};

export const TenBestMovies = () => (dispatch) => {
  dispatch(pending());
  axios.get(
    `${api}/movies/tenBest`,
  )
  .then(({ data: movies }) => {
    dispatch(fetched(movies));
  })
  .catch(console.error);
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
    dispatch(fetched(movies));
  })
  .catch(console.error)
};
