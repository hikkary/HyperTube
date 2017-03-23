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

  componentWillReceiveProps = (newProps) => {
    if(newProps.user){
      console.log('status', newProps.status);
      if (newProps.user.results.status === true) // Gerer du cote de joi le retour
        localStorage.setItem('token', newProps.user.headers['x-access-token']);
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
	  console.log(this.props);
	  const { user } = this.props;
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

        <div className="updateForm"/>
          <form onSubmit={this.login} className="loginForm">
            <ExtLogin />
			{user.results && user.results.errors && <div className="errorLogin">
				{this.errorHandler(user.results.errors)}
			</div>}
            <TextField
              floatingLabelText="Username"
              name="username"
  					  type="text"
            />
            <TextField
              floatingLabelText="Password"
              type="password"
              name="password"
            />
            <RaisedButton type="submit" label="SIGN IN" style={{ margin: '20px 0' }}/>
            <RaisedButton onClick={this.forgotPassword} label="FORGOT PASSWORD?"/>
          </form>
        <div>{this.state.message}</div>
      </div>
    )
  }
}
