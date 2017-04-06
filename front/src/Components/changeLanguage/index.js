import React, { Component } from 'react';
import axios from 'axios';
import api from '../../apiURI';
import RaisedButton from 'material-ui/RaisedButton';
import './sass/changeLanguage.sass';
import FR from '../../../public/am-flag.png';
import EN from '../../../public/fr-flag.png';

export default class changeLanguage extends Component {
  state = {
    user: '',
    error: '',
    currentLanguage: '',
  }

  onChange = (e) => {
    const text = e.target.value;
    this.setState({ [e.target.name]: text });
  }


  editProfile = (e) => {
    if (this.props.user && this.props.user.id) {
    e.preventDefault();
    if (!this.state.currentLanguage) this.setState({ currentLanguage: this.props.currentLanguage });
    const { user } = this.props.actions;
    const { currentLanguage } = this.state;
    axios({
      method: 'POST',
      url: `${api}/users/authEditProfile`,
      data: {
        id: this.props.user.id,
        currentLanguage,
      }
    })
    .then((results) => {
      if (results.data.errors) {
        return this.setState({ error: results.data.errors });
      }
      localStorage.setItem('token', results.headers['x-access-token']);
      const token = localStorage.getItem('token');
      user.getConnectedUser(token);
    });
  }
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
    const { translation } = this.props;
    return translation.current[error];
  }

  render(){
    const { current } = this.props.translation;
    const { user } = this.props;
    const { error } = this.state;
    return (
      <div className="editContainer">
        {user.length !== 0  &&
        <form onSubmit={this.editProfile} className="editProfileForm">
          <p className="lan">LANGUAGE</p>
          <button className="langButton" onClick={this.toFrench}>
            <img src={EN} role="presentation" className="language" />
          </button>
          <button className="langButton" onClick={this.toEnglish}>
            <img src={FR} role="presentation" className="language"/>
          </button>
          <RaisedButton type="submit" label={current.editProfile} className="editProfileSubmit" name="editProfile"/>
        </form>}
        {error && <div className="errorEditProfile" style={{ margin: 'auto' }}>
				{this.errorHandler(error)}
			   </div>}
      </div>
    )
  }
}
