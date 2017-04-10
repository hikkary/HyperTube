import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import './sass/Register.sass';
import RaisedButton from 'material-ui/RaisedButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import TextField from 'material-ui/TextField';
import FR from '../../../../public/am-flag.png';
import EN from '../../../../public/fr-flag.png';

export default class Register extends Component {
  state= {
    message: '',
    currentLanguage: 'en',
  }

  componentDidMount = () => {
    this._mounted = true;
    if (localStorage.getItem('token')) {
      browserHistory.push('/app/homePage');
    }
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  _mounted = false;

  componentWillReceiveProps = (newProps) => {
    if (newProps.user && newProps.user.success) {
      setTimeout(()=>{ browserHistory.push('/login') }, 2000);
    }
  }

  uploadImage = async(e) => {
    e.persist();
    if (!e.target.files[0]) {
      return;
    }
		const file = e.target.files[0];
		const img = new Image();
		img.onload = () => {
      if (!this._mounted) return false;
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
    browserHistory.push('/login');
  }

  register = (e) => {
    e.preventDefault();
    const { register } = this.props.actions.user;
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
    form.append('language', this.state.currentLanguage)
    register(form);
  };

  toFrench = (e) => {
    if (!this._mounted) return false;
    this.setState({ currentLanguage: 'fr' })
    this.props.actions.translation.toFrench();
  }

  toEnglish = (e) => {
    if (!this._mounted) return false;
    this.setState({ currentLanguage: 'en' })
    this.props.actions.translation.toEnglish();
  }

  errorHandler = (error) => {
    const { translation } = this.props;
    return translation.current[error];
  }

  render(){
	const { user } = this.props;
    const { current } = this.props.translation;

	return(
    <div>
      <div className="registerTitle">Sign up
        <div className="translation">
          <button className="langButton" onClick={this.toFrench}>
            <img src={EN} role="presentation" className="language" />
          </button>
          <button className="langButton" onClick={this.toEnglish}>
            <img src={FR} role="presentation" className="language"/>
          </button>
        </div>
      </div>
      <div>
        <FloatingActionButton
          backgroundColor="#e0001b" style={{
            marginTop: '-30px',
            float: 'right',
            marginRight: '10px',
          }}
        >
          <i className="fa fa-sign-in fa-2x signInIcon" aria-hidden="true" onClick={this.loginForm}></i>
        </FloatingActionButton>
      </div>
      <form onSubmit={this.register} className="registerForm">
        {user && user.errors && <div className="errorRegister">
    			{this.errorHandler(user.errors)}
    		</div>}
        {user && user.success && <div className="successRegister" style={{ textAlign: 'center' }}>
          {this.errorHandler(user.success)}
        </div>}
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
        <RaisedButton
          label="Choose an Image"
          labelPosition="before"
          className="imageUpload"
          containerElement="label"
          >
          <input type="file" name="imageUpload" className="uploadInput" onChange={this.uploadImage} />
        </RaisedButton>
        <RaisedButton type="submit" label={current.register} className="registerSubmit" name="register" style={{ marginBottom: '20px' }}/>
      </form>
      <div>{this.state.message}</div>
    </div>
    )
  }
}
