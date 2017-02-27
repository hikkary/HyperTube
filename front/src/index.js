import React from 'react';
import ReactDOM from 'react-dom';
import App from './Containers/App';
import Auth from './Containers/Auth';
import './index.css';
import { Route, Router, browserHistory, Redirect} from 'react-router';
import reducers from './Reducers';
import { applyMiddleware, createStore } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import * as movies from './Actions/movies';

const initialState = {
  movies: [],
};

const store = createStore(
  reducers,
  initialState,
  applyMiddleware(
    logger(),
    thunk,
  ),
);

store.dispatch(movies.getMovie());

ReactDOM.render(
  <Provider store={store} >
  	<Router history={browserHistory}>
  		<Route path="/" component={Auth}>
  		</Route>
  		<Route path="/app" component={App}>
  		</Route>
  		<Redirect from="/*" to="/" />
  	</Router>
  </Provider>,
  document.getElementById('root')
);
