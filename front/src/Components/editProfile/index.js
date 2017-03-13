import React, { Component } from 'react';
import axios from 'axios';
import api from '../../apiURI';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

// todo change image
export default class EditProfile extends Component {
  state = {
    user: '',
  }

  componentWillReceiveProps = (newProps) => {
    console.log('new props', newProps);
  }

  onChange = (e) => {
    const text = e.target.value;
    this.setState({ [e.target.name]: text });
  }

  editProfile = (e) => {
    e.preventDefault();
    const { username, firstname, lastname, email, } = e.target;
    console.log('target', e.target.username.value);
    // const { image } = this.state;
    const form = new FormData();
    form.append('id', this.props.user.id)
    form.append('username', username.value)
    form.append('firstname', firstname.value)
    form.append('lastname', lastname.value)
    form.append('email', email.value)
    console.log(form);
    // form.append('image', image)
    // form.append('language', this.state.currentLanguage)
    axios({
      method: 'POST',
      url: `${api}/users/editProfile`,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: form,
    })
    .then((results) => {
      console.log(results);
    })
  }

  render(){
    const { current } = this.props.translation;
    const { user } = this.props;
    console.log("PROPS RENDER", user);
    return (
      <div>
        {user.length !== 0  &&
        <form onSubmit={this.editProfile} className="editProfile">
          <TextField
            floatingLabelText={current.username}
            name="username"
            type="text"
            defaultValue={user.username}
            onChange={this.onChange}
          />
          <TextField
            floatingLabelText={current.firstname}
            name="firstname"
            type="text"
            defaultValue={user.firstname}
            onChange={this.onChange}
          />
          <TextField
            floatingLabelText={current.lastname}
            name="lastname"
            type="text"
            defaultValue={user.lastname}
            onChange={this.onChange}
          />
          <TextField
            floatingLabelText={current.email}
            name="email"
            type="text"
            defaultValue={user.email}
            onChange={this.onChange}
          />
          <RaisedButton
            label="Choose an Image"
            labelPosition="before"
            className="imageUpload"
            containerElement="label"
          >
            <input type="file" name="imageUpload" className="uploadInput" onChange={this.convertImage} />
          </RaisedButton>
          <RaisedButton type="submit" label="Edit Profile" className="editProfileSubmit" name="editProfile"/>
        </form>
      }
      </div>
    )
  }
}
