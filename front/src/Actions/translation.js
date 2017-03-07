// import axios from 'axios';
// import api from '../apiURI';
import translation from '../translation';

export const GET = 'TRANSLATION_GET';
export const PENDING = 'TRANSLATION_PENDING';
export const FRENCH = 'TRANSLATION_FRENCH';
export const ENGLISH = 'TRANSLATION_ENGLISH';

export const pending = () => ({
  type: PENDING,
});

export const displayTranslation = () => ({
  type: GET,
  payload: translation,
});

export const toFrench = () => ({
  type: FRENCH,
  payload: translation,

})

export const toEnglish = () => ({
  type: ENGLISH,
  payload: translation,
})
// export const getTranslation = () => (dispatch) => {
//   dispatch(pending());
//   axios.get(
//     `${api}/movie/display`,
//   )
//   .then(({ data: movies}) => {
//     dispatch(display(movies));
//   })
//   .catch(console.error)
// }
