import React from 'react';
import { browserHistory } from 'react-router';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import './style/header.sass';

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
        <img className="logo" role="presentation" src="logo.gif" height="60px" width="300px"/>
        {/*  Quand le fichier est dans le public on a pas besoin de mettre le path*/}
        <input type="text" className="Search" placeholder="Search..."></input>
        <div className="HeaderButton">
        <RaisedButton  className="RaisedButton" backgroundColor="#e0001b" onClick={this.toHome} style={{
          lineHeight: '70px',
          backgroundColor: "#e0001b"
        }}>
        <i className="material-icons">home</i>
        </RaisedButton>
        <RaisedButton className="RaisedButton" backgroundColor="#e0001b" onClick={this.toMovies} label="Movies" style={{
          lineHeight: '70px',
          backgroundColor: "#e0001b"
        }} />
        <RaisedButton  className="RaisedButton" backgroundColor="#e0001b" onClick={this.toSeries} label="Series" style={{
          lineHeight: '70px',
          backgroundColor: "#e0001b"
        }} />
      </div>
			</div>
      <div className="SubMenu" />
    </div>
		);
	}
}
