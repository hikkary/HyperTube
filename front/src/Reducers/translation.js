import { GET, FRENCH, ENGLISH } from '../Actions/translation';

export default (state = [], action) => {
  switch (action.type) {
    case GET:
      return { ...action.payload, current: action.payload.en };
    case FRENCH:
      return { ...action.payload, current: action.payload.fr };
    case ENGLISH:
      return { ...action.payload, current: action.payload.en };
    default: return state;
  }
}
