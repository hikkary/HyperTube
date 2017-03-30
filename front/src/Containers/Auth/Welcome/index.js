import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import title from '../../../../public/logo2.png';
import bg from '../../../../public/background-hypertube.png';
import './Welcome.sass';
import FlatButton from 'material-ui/FlatButton';

export default class Welcome extends Component {
  state = {
    button: true,
  }
  getStarted = (e) => {
    this.setState({ button: false });
    // e.target.style.display = 'none';
    browserHistory.push('login');
  }

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

// {this.state.button && <FlatButton label="GET STARTED" style={{ color: 'white' }} onClick={this.getStarted}/>}
