import React, { Component } from 'react';
import './Register.sass';
import { browserHistory } from 'react-router';
import './Register.sass';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import FR from '../../../public/am-flag.gif';
import EN from '../../../public/fr-flag.gif';

export default class Register extends Component {
  state= {
    message: '',
  }

  componentDidMount = () =>{
    console.log(this.convertImage);
  }

  componentWillReceiveProps = (newProps) => {
    console.log('REgister newProps',newProps);
    // this.setState({ message: newProps.register.details });
  }

  convertImage = async(e) => {
    if (!e.target.files[0])
      return
		const file = e.target.files[0];
		const img = new Image();

		e.persist()
		img.onload = () => {
      this.setState({ message: 'Picture Uploaded' });
      this.setState({ image: file })
		};
		img.onerror = () => {
      this.setState({message: 'The picture is not valid'});
      e.target.value = "";
		}
		const _URL = window.URL || window.webkitURL;
		img.src = _URL.createObjectURL(file);
	}

  loginForm = () => {
    browserHistory.push('/');
  }

  register = (e) => {
    e.preventDefault();
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
    const {current} = this.props.translation;
    return(
      <div>
        <div className="translation">
          <button className="langButton" onClick={this.props.actions.translation.toFrench}>
            <img src={EN} className="language" />
          </button>
          <button className="langButton" onClick={this.props.actions.translation.toEnglish}>
            <img src={FR} className="language"/>
          </button>
        </div>
        <i className="fa fa-sign-in fa-2x signInIcon" aria-hidden="true" onClick={this.loginForm}></i>
        <div className="registerTitle">Sign up </div>
        <form onSubmit={this.register} className="registerForm">
          <TextField
            floatingLabelText={current.username}
            name="username"
            type="text"
          />
          <TextField
            floatingLabelText={current.firstname}
            name="firstname"
            type="text"
          />
          <TextField
            floatingLabelText={current.lastname}
            name="lastname"
            type="text"
          />
          <TextField
            floatingLabelText={current.email}
            name="email"
            type="text"
          />
          <TextField
            floatingLabelText={current.password}
            name="password"
            type="password"
          />
          <TextField
            floatingLabelText={current.confirm}
            type="password"
            name="confirm"
          />
          <FlatButton
            label="Choose an Image"
            labelPosition="before"
            className="imageUpload"
            containerElement="label"
          >
            <input type="file" name="imageUpload" className="uploadInput" onChange={this.convertImage} />
          </FlatButton>
          <RaisedButton type="submit" label={current.register} className="registerSubmit" name="register"/>
        </form>
        <div>{this.state.message}</div>
      </div>
    )
  }
}
