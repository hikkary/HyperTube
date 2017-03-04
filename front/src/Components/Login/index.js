import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import crypto from 'crypto';

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

  login = (e) =>{
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

  render() {
    return(
      <div>
        <span>Login</span>
          <form onSubmit={this.login}>
            <input type="text" placeholder="username" name="username"  />
            <input type="password" placeholder="password" name="password" />
            <button type="submit" name="register">Login</button>
          </form>
        <div>{this.state.message}</div>
      </div>
    )
  }
}
