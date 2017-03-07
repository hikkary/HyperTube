import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import { browserHistory } from 'react-router';
import ExtLogin from '../OmniAuth';
import FlatButton from 'material-ui/FlatButton';
import Register from '../../../public/AddUser.png';
import './Login.sass';

export default class Login extends Component {
  state= {
    message: '',
  }

  componentWillReceiveProps = (newProps) => {

    console.log('Login newProps',newProps);
    if(newProps.users){
    this.setState({ message: newProps.login.details });
      if(newProps.users.status === true)
        localStorage.setItem('token', newProps.login.headers['x-access-token']);
      }
  };

  login = (e) => {
    e.preventDefault();
    const { actionlogin } = this.props.actions.login;
    const { username,password } = e.target;
    const userInfo = {
      username: username.value,
      password: password.value,
    }
    if (username && password)
      actionlogin(userInfo);
  }

  registerForm = () => {
    console.log('hey');
    browserHistory.push('/register');
  }

  render() {
    return(
      <div>
        <div className="loginTitle">Sign in</div>
        <hr />
        <div>
          <img src={Register} className="AddUser" onClick={this.registerForm} />
        </div>
        <div className="loginForm"/>
          <form onSubmit={this.login} className="loginForm">
            <ExtLogin />
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
            <FlatButton type="submit" label="SIGN IN"/>
            <FlatButton label="FORGOT PASSWORD?"/>
          </form>
        <div>{this.state.message}</div>
      </div>
    )
  }
}
