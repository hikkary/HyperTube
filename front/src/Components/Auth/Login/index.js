import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import { browserHistory } from 'react-router';
import ExtLogin from '../OmniAuth';
import RaisedButton from 'material-ui/RaisedButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import './sass/Login.sass';

export default class Login extends Component {
  state= {
    message: '',
  }

  componentDidMount = () => {
    if (this.props && this.props.token) {
      localStorage.setItem('token', this.props.token);
      browserHistory.push('/app/homePage');
    }
    if (localStorage.getItem('token')) {
      browserHistory.push('/app/homePage');
    }
  };

  componentWillReceiveProps = (newProps) => {
    if(newProps && newProps.user && newProps.user.length !== 0){
      if (newProps.user.results.status === true) { // Gerer du cote de joi le retour
        localStorage.setItem('token', newProps.user.headers['x-access-token']);
      }
    }
  };

  login = (e) => {
    e.preventDefault();
    const { actionLogin } = this.props.actions.user;
    const { username,password } = e.target;
    const userInfo = {
      username: username.value,
      password: password.value,
    }
    if (username && password) {
      actionLogin(userInfo);
    }
  }

  registerForm = () => {
    browserHistory.push('/register');
  }

  forgotPassword = () => {
    browserHistory.push('/forgotPassword');
  }

	errorHandler = (error) => {
		const { translation } = this.props;
		return translation.current[error];
	}

  render() {
	  const { user } = this.props;
    const { current } = this.props.translation;
    return(
      <div>
        <div className="loginTitle">Sign in</div>
        <FloatingActionButton
          backgroundColor="#e0001b" style={{
            marginTop: '-26px',
            float: 'right',
            marginRight: '10px',
          }}
          onClick={this.registerForm}
        >
        <i className="material-icons">person_add</i>
		    </FloatingActionButton>
        <form onSubmit={this.login} className="loginForm">
          <ExtLogin />
			    {user.results && user.results.errors && <div className="errorLogin">
				    {this.errorHandler(user.results.errors)}
			    </div>}
          <TextField
            floatingLabelText={current.username}
            name="username"
  					type="text"
          />
          <TextField
            floatingLabelText={current.password}
            type="password"
            name="password"
          />
          <RaisedButton type="submit" label={current.signIn} style={{ margin: '20px 0' }}/>
          <RaisedButton onClick={this.forgotPassword} label={current.forgotPassword}/>
        </form>
        <div>{this.state.message}</div>
      </div>
    )
  }
}
