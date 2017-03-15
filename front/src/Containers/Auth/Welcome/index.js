import React, { Component } from 'react';
import title from '../../../../public/logo2.png';
import bg from '../../../../public/background-hypertube.jpg';
import './Welcome.sass';

export default class Welcome extends Component {
  render(){
    return(
      <div className="authContainer">
        <img src={title} role="presentation" className="logoTitle" />
          <div className="authBackground"
            style={{ backgroundImage: `url(${bg})` }}
          />
        <div>
          {this.props.children}
        </div>
      </div>
    )
  }
}
