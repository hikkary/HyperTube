 import React from 'react';
import ReactDOM from 'react-dom';
import App from './Containers/App';
import Series from './Containers/Series';
import Auth from './Containers/Auth';
import Register from './Containers/Register';
import './index.css';
import { Route, Router, browserHistory, Redirect} from 'react-router';
import reducers from './Reducers';
import { applyMiddleware, createStore } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import * as translation from './Actions/translation';
// import * as series from './Actions/series';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

const initialState = {
  movies: [],
  series: [],
  register: [],
  login: [],
  translation: [],
};

const store = createStore(
  reducers,
  initialState,
  applyMiddleware(
    logger(),
    thunk,
  ),
);

store.dispatch(translation.displayTranslation());
// store.dispatch(series.getSerie());

ReactDOM.render(
  <Provider store={store} >
    <MuiThemeProvider>
    	<Router history={browserHistory}>
        <Route path="/" component={Auth}>
        </Route>
      	<Route path="/register" component={Register}>
      	</Route>
        <Route path="/app" component={App}>
        </Route>
        <Route path="/series" component={Series}>
      	</Route>
      </Router>
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('root')
);
