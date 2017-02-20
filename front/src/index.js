import React from 'react';
import ReactDOM from 'react-dom';
import App from './containers/App';
import Auth from './containers/Auth';
import './index.css';
import { Route, Router, browserHistory, Redirect} from 'react-router';

ReactDOM.render(
	<Router history={browserHistory}>
		<Route path="/" component={Auth}>
		</Route>
		<Route path="/app" component={App}>
		</Route>
		<Redirect from="/*" to="/" />
	</Router>,
  document.getElementById('root')
);
