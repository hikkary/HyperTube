import React from 'react';
import ReactDOM from 'react-dom';
import App from './Containers/App';
import Series from './Containers/Series';
import Auth from './Containers/Auth';
import './index.css';
import { Route, Router, browserHistory, Redirect} from 'react-router';
import reducers from './Reducers';
import { applyMiddleware, createStore } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import * as movies from './Actions/movies';
import * as series from './Actions/series';

const initialState = {
  movies: [],
  series: [],
};

const store = createStore(
  reducers,
  initialState,
  applyMiddleware(
    logger(),
    thunk,
  ),
);

// store.dispatch(movies.getMovie());
// store.dispatch(series.getSerie());

ReactDOM.render(
  <Provider store={store} >
  	<Router history={browserHistory}>
  		<Route path="/" component={Auth}>
  		</Route>
      <Route path="/app" component={App}>
      </Route>
      <Route path="/series" component={Series}>
  		</Route>
  		<Redirect from="/*" to="/" />
  	</Router>
  </Provider>,
  document.getElementById('root')
);
