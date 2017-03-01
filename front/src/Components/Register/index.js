import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import crypto from 'crypto';

export default class Register extends Component {
  state= {
    message: '',
  }

  componentWillReceiveProps = (newProps) => {
    this.setState({ message: newProps.users.details });
    if(newProps.users.token){
      localStorage.setItem("token",newProps.users.token)
  		browserHistory.push('/app/')
  }
  };

  register = (e) => {
    e.preventDefault();
    // const hashPass = crypto.createHash('rmd160').update(e.target.password.value).digest('base64');
    // const confirmHash = crypto.createHash('rmd160').update(e.target.confirm.value).digest('base64');
    const { register } = this.props.actions.users;
    const { username, firstname, lastname, email, password, confirm } = e.target;
    const userInfo = {
      username: username.value,
      firstname: firstname.value,
      lastname: lastname.value,
      email: email.value,
      password: password.value,
      confirm: confirm.value,
    }
    register(userInfo);
  };

  login = (e) =>{
    e.preventDefault();
    const { login } = this.props.actions.users;
    const { username,password } = e.target;
    const userInfo = {
      username: username.value,
      password: password.value,
    }
    login(userInfo);
  }


  render(){
    return(
      <div>
        <form onSubmit={this.register} >
          <input type="text" placeholder="username" name="username"  />
          <input type="text" placeholder="firstname" name="firstname" />
          <input type="text" placeholder="lastname" name="lastname" />
          <input type="text" placeholder="email" name="email" />
          <input type="password" placeholder="password" name="password" />
          <input type="password" placeholder="confirm password" name="confirm"  />
          <button type="button" name="picture">Add Picture </button>
          <button type="submit" name="register">Register </button>
        </form>
        <div>
          <span>Login</span>
          <form onSubmit={this.login}>
            <input type="text" placeholder="username" name="username"  />
            <input type="password" placeholder="password" name="password" />
            <button type="submit" name="register">Login</button>
          </form>
        </div>
        <div>{this.state.message}</div>
      </div>
    )
  }
}
