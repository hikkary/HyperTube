import React, { Component } from 'react';
import axios from 'axios';
import api from '../../apiURI';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import './sass/EditProfile.sass';
import FR from '../../../public/am-flag.png';
import EN from '../../../public/fr-flag.png';

export default class EditProfile extends Component {
  state = {
    user: '',
    error: '',
    currentLanguage: '',
  }

  // componentWillReceiveProps = (newProps) => {
  //   if(newProps.user){
  //     console.log(newProps.user.language);
  //   this.setState({currentLanguage: newProps.user.language})
  //   console.log(this.state, "STATE");
  // }
  // }

  onChange = (e) => {
    const text = e.target.value;
    this.setState({ [e.target.name]: text });
  }

  getImage = async(e) => {
    e.persist();
    if (!e.target.files[0]) return;
    const file = e.target.files[0];
    const img = new Image();
    img.onload = () => {
      this.setState({ message: 'Picture Uploaded' });
      this.setState({ image: file });
    };
    img.onerror = () => {
      this.setState({ message: 'The picture is not valid' });
      e.target.value = "";
    }
    const _URL = window.URL || window.webkitURL;
    img.src = _URL.createObjectURL(file); //base64 creation
  }

  editProfile = (e) => {
    e.preventDefault();
    if(!this.state.currentLanguage) this.setState({currentLanguage: this.props.currentLanguage})
    const { user } = this.props.actions;
    const { username, firstname, lastname, email, } = e.target;
    const { image } = this.state;
    const form = new FormData();
    form.append('id', this.props.user.id)
    form.append('username', username.value)
    form.append('firstname', firstname.value)
    form.append('lastname', lastname.value)
    form.append('email', email.value)
    form.append('image', image)
    form.append('language', this.state.currentLanguage)
    axios({
      method: 'POST',
      url: `${api}/users/editProfile`,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: form,
    })
    .then((results) => {
      console.log('results', results.data);
      if (results.data.errors) {
        return this.setState({ error: results.data.errors });
      }
      localStorage.setItem('token', results.headers['x-access-token']);
      const token = localStorage.getItem('token');
      user.getConnectedUser(token);
    });
  }

  toFrench = (e) => {
    e.preventDefault()
    this.setState({ currentLanguage: 'fr' })
    this.props.actions.translation.toFrench();
  }

  toEnglish = (e) => {
    e.preventDefault()
    this.setState({ currentLanguage: 'en' })
    this.props.actions.translation.toEnglish();
  }

  errorHandler = (error) => {
    console.log('ggggggggg', error);
    const { translation } = this.props;
    return translation.current[error];
  }

  render(){
    const { current } = this.props.translation;
    const { user } = this.props;
    const { error } = this.state;
    console.log("user",user);
    return (
      <div className="editContainer">
        {user.length !== 0  &&
        <form onSubmit={this.editProfile} className="editProfileForm">

          <TextField
            floatingLabelText={current.username}
            name="username"
            type="text"
            defaultValue={user.username}
            onChange={this.onChange}
            inputStyle={{
              color: 'white'
            }}
          />
          <TextField
            floatingLabelText={current.firstname}
            name="firstname"
            type="text"
            defaultValue={user.firstname}
            onChange={this.onChange}
            inputStyle={{
              color: 'white'
            }}
          />
          <TextField
            floatingLabelText={current.lastname}
            name="lastname"
            type="text"
            defaultValue={user.lastname}
            onChange={this.onChange}
            inputStyle={{
              color: 'white'
            }}
          />
          <TextField
            floatingLabelText={current.email}
            name="email"
            type="text"
            defaultValue={user.email}
            onChange={this.onChange}
            inputStyle={{
              color: 'white'
            }}
          />
          {user && user.picture && <img src={`http://localhost:8080/public/${user.picture}`} className="photo" role="presentation" />}
          <RaisedButton
            label={current.editImage}
            labelPosition="before"
            className="editButton"
            containerElement="label"
            type="submit"
          >
            <input type="file" name="imageUpload" className="uploadInput" onChange={this.getImage} />
          </RaisedButton>
          <p>LANGUAGE</p>
          <button className="langButton" onClick={this.toFrench}>
            <img src={EN} role="presentation" className="language" />
          </button>
          <button className="langButton" onClick={this.toEnglish}>
            <img src={FR} role="presentation" className="language"/>
          </button>
          <RaisedButton type="submit" label={current.editProfile} className="editProfileSubmit" name="editProfile"/>
        </form>
      }
      {error && <div className="errorLogin">
				{this.errorHandler(error)}
			</div>}
    </div>
    )
  }
}
