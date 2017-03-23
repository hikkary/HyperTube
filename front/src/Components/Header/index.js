import React from 'react';
import { browserHistory } from 'react-router';
import FlatButton from 'material-ui/FlatButton';
import './sass/header.sass';
import logo from  '../../../public/logo.gif';
// import poule from '../../../public/poule.jpg';

export default class Header extends React.Component {

  componentDidMount() {
    this._mounted = true;
    const token = localStorage.getItem("token");
    const { getConnectedUser } = this.props.actions.user;
    if(!token) {
      browserHistory.push('/login');
    }
    getConnectedUser(token);
  };

  _mounted = false;

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
    console.log('entered edit profile');
    browserHistory.push('/app/user/editProfile');
  };

  logout = () => {
    localStorage.removeItem('token');
    browserHistory.push('/login');
  };

	render(){
    const { user } = this.props;
    console.log("PROPS",this.props.user.picture);
    console.log("PROPS",typeof(this.props.user.picture));
		return(
    <div>
      <div className="Header">
        <img onClick={this.toHome} className="logo" role="presentation" src={logo} height="60px" width="300px"/>
        <div className="HeaderButton">
          {user.length !== 0 && this.props.user.picture && <div
            onClick={this.toProfile}
            style={{
              backgroundImage: `url('http://localhost:8080/public/${this.props.user.picture}')`,
              }}
            className="profilePicture" ></div>}
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
