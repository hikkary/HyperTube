import React, { Component } from 'react';
import { connect } from 'react-redux';
import title from '../../../public/logo2.png';
import bg from '../../../public/background-hypertube.jpg';
import './Auth.sass';

export default class Auth extends Component {

  render(){
    console.log(this.props);
    return(
      <div className="authContainer">
        <img src={title} role="presentation" className="logoTitle" />
          <div className="masterBG"
            style={{ backgroundImage: `url(${bg})` }}
          />
        <div>
          {this.props.children}
        </div>
      </div>
    )
  }
}
