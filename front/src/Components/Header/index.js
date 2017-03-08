import React from 'react';
import { browserHistory } from 'react-router';
import FlatButton from 'material-ui/FlatButton';
import './style/header.sass';
import logo from  '../../../public/logo.gif';

export default class Header extends React.Component {

  toMovies = () => {
    browserHistory.push('/app/movies')
  }

  toSeries = () => {
    browserHistory.push('/app/series')
  }

  toHome = () => {
    browserHistory.push('/app')
  }

	render(){
		return(
    <div>
      <div className="Header">
        <img className="logo" role="presentation" src={logo} height="60px" width="300px"/>
        {/*  Quand le fichier est dans le public on a pas besoin de mettre le path*/}
        <input type="text" className="Search" placeholder="Search..."></input>
        <div className="HeaderButton">
        <FlatButton
          backgroundColor="#e0001b"
          onClick={this.toHome}
          style={{
            backgroundColor: "#e0001b"
          }}
        >
        <i className="material-icons">home</i>
      </FlatButton>
        <FlatButton
          backgroundColor="#e0001b"
          onClick={this.toMovies}
          label="Movies"
          style={{
            backgroundColor: "#e0001b"
          }}
        />
        <FlatButton
          backgroundColor="#e0001b"
          onClick={this.toSeries}
          label="Series"
          style={{
            backgroundColor: "#e0001b",
            height: '100%',
          }}
        />
      </div>
			</div>
      <div className="SubMenu" />
    </div>
		);
	}
}
