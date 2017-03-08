import axios from 'axios';
import api from '../apiURI';

export const GET = 'MOVIE_GET';
export const PENDING = 'MOVIE_PENDING';
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

export const getMovie = () => (dispatch) => {
  dispatch(pending());
  axios.get(
    `${api}/movie/display`,
  )
  .then(({ data: movies }) => {
    dispatch(display(movies));
  })
  .catch(console.error)
}

export const TenBestMovies = () => (dispatch) => {
  dispatch(pending());
  axios.get(
    `${api}/movie/tenBest`,
  )
  .then(({ data: movies }) => {
    dispatch(display(movies));
  })
  .catch(console.error)
}

export const getGenre = (genre) => (dispatch) => {
  dispatch(pending());
  axios({
    method: 'POST',
    url: `${api}/movie/getGenre`,
    data: {
      genre: genre,
    }
  }
  )
  .then(({ data: movies }) => {
    dispatch(display(movies));
  })
  .catch(console.error)
}
