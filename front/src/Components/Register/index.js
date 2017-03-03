import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import crypto from 'crypto';

export default class Register extends Component {
  state= {
    message: '',
  }

  componentDidMount = () =>{
    console.log(this.convertImage);
  }

  componentWillReceiveProps = (newProps) => {
    console.log('REgister newProps',newProps);
    this.setState({ message: newProps.register.details });
  };

  convertImage = async(e) => {
    console.log(e.target);
    if(!e.target.file[0])
      return
		const file = e.target.files[0];
		const img = new Image();

		e.persist()
		img.onload = () => {
      this.setState({message: 'Picture Uploaded'});
      this.setState({ image: file })
		};
		img.onerror = () => {
      this.setState({message: 'The picture is not valid'});
      e.target.value = "";
		}
		const _URL = window.URL || window.webkitURL;
		img.src = _URL.createObjectURL(file);
	}

  register = (e) => {
    e.preventDefault();
    // const hashPass = crypto.createHash('rmd160').update(e.target.password.value).digest('base64');
    // const confirmHash = crypto.createHash('rmd160').update(e.target.confirm.value).digest('base64');
    const { register } = this.props.actions.register;
    const { username, firstname, lastname, email, password, confirm } = e.target;
    const { image } = this.state;
    const form = new FormData();
    form.append('username', username.value)
    form.append('firstname', firstname.value)
    form.append('lastname', lastname.value)
    form.append('email', email.value)
    form.append('password', password.value)
    form.append('confirm', confirm.value)
    form.append('image', image)
    register(form);
  };
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
          <input type="file"  className="imageUpload" name="imageUpload" onChange={this.convertImage}/>
          <button type="submit" name="register">Register </button>
        </form>
        <div>{this.state.message}</div>
      </div>
    )
  }
}
