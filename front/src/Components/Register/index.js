import React, { Component } from 'react';
import crypto from 'crypto';

export default class Register extends Component {
  state= {
    message: '',
  }

  componentWillReceiveProps = (newProps) => {
    this.setState({ message: newProps.users });
  };

  register = (e) => {
    e.preventDefault();
    const hashPass = crypto.createHash('rmd160').update(e.target.password.value).digest('base64');
    const confirmHash = crypto.createHash('rmd160').update(e.target.confirm.value).digest('base64');
    const { register } = this.props.actions.users;
    const { username, firstname, lastname, email, password } = e.target;
    const userInfo = {
      username: username.value,
      firstname: firstname.value,
      lastname: lastname.value,
      email: email.value,
      password: hashPass,
      confirm: confirmHash,
    }
    register(userInfo);
  };


  render(){
    const { username } = this.state;
    return(
      <div>
        <form onSubmit={this.register} >
          <input type="text" placeholder="username" name="username" value="" />
          <input type="text" placeholder="firstname" name="firstname" value=""/>
          <input type="text" placeholder="lastname" name="lastname" value=""/>
          <input type="text" placeholder="email" name="email" value=""/>
          <input type="password" placeholder="password" name="password" value=""/>
          <input type="password" placeholder="confirm password" name="confirm" value="" />
          <button type="button" name="picture">Add Picture </button>
          <button type="submit" name="register">Register </button>
        </form>
        <div>{this.state.message}</div>
      </div>
    )
  }
}
