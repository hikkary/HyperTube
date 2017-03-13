import React from 'react';
import axios from 'axios';
import { browserHistory } from 'react-router';
import FlatButton from 'material-ui/FlatButton';
import './style/header.sass';
import logo from  '../../../public/logo.gif';
import api from '../../apiURI';

export default class Header extends React.Component {
  state={
    search: '',
    id: '',
    user: '',
  }

  componentDidMount() {
    const token = localStorage.getItem("token");
    console.log(this.props);
    const { getConnectedUser } = this.props.actions.user;
    if(!token) {
    }
    getConnectedUser(token);
  }

  toMovies = () => {
    browserHistory.push('/app/movies')
  }

  toSeries = () => {
    browserHistory.push('/app/series')
  }

  toHome = () => {
    browserHistory.push('/app/homePage')
  }

  toProfile = () => {
    browserHistory.push(`/app/user/profile/${this.props.user.id}`);
  }

  toEditProfile = () => {
    console.log('entered edit profile');
    browserHistory.push('/app/user/editProfile');
  }

  logout = () => {
    localStorage.removeItem('token');
    browserHistory.push('/');
  }

	render(){
    const { user } = this.props;
    console.log(user);
		return(
    <div>
      <div className="Header">
        <img onClick={this.toHome} className="logo" role="presentation" src={logo} height="60px" width="300px"/>
        <div className="HeaderButton">
          {user.length !== 0 && <div
            onClick={this.toProfile}
            style={{
              backgroundImage: `url('http://localhost:8080/public/${this.props.user.picture}')`,
              backgroundSize: 'cover',
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              }}
            className="profilePicture"
              >
          </div>}
          <FlatButton
            backgroundColor="#e0001b"
            onClick={this.toEditProfile}
            label="editProfile"
            style={{
              backgroundColor: "#e0001b"
            }}
          />
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
            <FlatButton
              backgroundColor="#e0001b"
              onClick={this.logout}
              label="Logout"
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
