import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import { browserHistory } from 'react-router';
import ExtLogin from '../OmniAuth';
import RaisedButton from 'material-ui/RaisedButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
// import Register from '../../../public/AddUser.png';
import './Login.sass';

export default class Login extends Component {
  state= {
    message: '',
  }

  componentWillReceiveProps = (newProps) => {

    console.log('Login newProps',newProps);
    if(newProps.user){
    // this.setState({ message: newProps.user.details });
      if(newProps.user.results.status === true)
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
    if (username && password)
      actionLogin(userInfo);
  }

  registerForm = () => {
    console.log('hey');
    browserHistory.push('/register');
  }

  forgotPassword = () => {
    console.log('hey');
    browserHistory.push('/forgotPassword');
  }

  render() {
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
            <RaisedButton type="submit" label="SIGN IN" style={{ margin: '20px 0' }}/>
            <RaisedButton onClick={this.forgotPassword} label="FORGOT PASSWORD?"/>
          </form>
        <div>{this.state.message}</div>
      </div>
    )
  }
}
