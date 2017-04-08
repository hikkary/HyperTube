import React from 'react';
import { browserHistory } from 'react-router';
import './sass/header.sass';
import logo from  '../../../public/logo2.png';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import axios from 'axios';
import api from '../../apiURI';

/* global FB */

export default class Header extends React.Component {
  state = {
    lang: false,
  }

  _mounted = false;

  componentWillReceiveProps = (newProps) =>{
    if (!this._mounted) return false;
    if (newProps.user.language) {
      if(newProps.user.language === 'fr' && !this.state.lang){
        this.props.actions.translation.toFrench();
        this.setState({ lang: true });
      }
      if (newProps.user.language === 'en' && !this.state.lang) {
        this.props.actions.translation.toEnglish();
        this.setState({ lang: true });
      }
    }
  }

  componentDidMount() {
    this._mounted = true;
    window.fbAsyncInit = () => {
      FB.init({
        appId      : '1058421674304180',
        cookie     : true,  // enable cookies to allow the server to access
        xfbml      : true,  // parse social plugins on this page
        version    : 'v2.7' // use graph api version 2.8
      });
    }
    const token = localStorage.getItem("token");
    const { getConnectedUser } = this.props.actions.user;
    if (!token) {
      browserHistory.push('/login');
	  return;
    }
    getConnectedUser(token);
  };

  componentWillUnmount() {
    this._mounted = false;
  }

  toMovies = () => {
    browserHistory.push('/app/movies');
  };

  toSeries = () => {
    browserHistory.push('/app/series');
  };

  toHome = () => {
    browserHistory.push('/app/homePage');
  };

  toProfile = () => {
    browserHistory.push(`/app/user/profile/${this.props.user.id}`);
  };

  toEditProfile = () => {
    browserHistory.push('/app/user/editProfile');
  };

  toChangeLanguage = () => {
    browserHistory.push('/app/user/changeLanguage');
  }

  deleteAccount = () => {
    axios({
      method: 'POST',
      url: `${api}/users/deleteAccount`,
      data: {
        id: this.props.user.id,
      }
    }).then((result) => {
      if (result.data.status === true) {
        localStorage.removeItem('token');
        browserHistory.push('/login');
      }
    });
  };

  logout = () => {
    if (this.props.user.provider === 'facebook') {
      FB.getLoginStatus((response) => {
        if (response.status === 'connected') {
          FB.logout();
        }
      });
    }
    const { user } = this.props.actions.user;
    user([]);
    localStorage.removeItem('token');
    browserHistory.push('/login');
  };

	render(){
    const { user } = this.props;
    const { current } = this.props.translation;
		return(
      <div>
        <div className="Header">
          <img onClick={this.toHome} className="logo" role="presentation" src={logo} height="40px" width="250px"/>
          <div className="HeaderButton">
            {user.length !== 0 && user.picture && !user.provider && <div
              onClick={this.toProfile}
              style={{
                backgroundImage: `url('http://localhost:8080/public/${this.props.user.picture}')`,
                }}
              className="profilePicture" ></div>}
            {user.length !== 0 && user.picture && user.provider && <div
              onClick={this.toProfile}
              style={{
                backgroundImage: `url(${user.picture})`,
              }}
              className="profilePicture" ></div>}
              <IconMenu
                iconButtonElement={
                  <IconButton
                    iconStyle={{ color: 'white' }}
                  >
                    <i className="material-icons">menu</i>
                  </IconButton>
                }
                targetOrigin={{horizontal: 'right', vertical: 'top'}}
                anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
              >
                {!user.provider && <MenuItem primaryText={current.editProfile} onClick={this.toEditProfile} />}
                {user.provider && <MenuItem primaryText={current.changeLanguage} onClick={this.toChangeLanguage} />}
                <MenuItem primaryText={current.movies} onClick={this.toMovies} />
                <MenuItem primaryText={current.series} onClick={this.toSeries} />
                <MenuItem primaryText={current.deleteAccount} onClick={() => {
                  if (confirm('Delete Your Account?') === true) {
                    this.deleteAccount(); } } }/>
                <MenuItem primaryText={current.logout} onClick={this.logout}/>
              </IconMenu>
          </div>
  			</div>
        <div className="SubMenu" />
      </div>
		);
	}
}
