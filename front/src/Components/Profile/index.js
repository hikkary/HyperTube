import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import axios from 'axios';
import api from '../../apiURI';
import './sass/Profile.sass';

export default class Profile extends Component {
  state = {
    user: '',
    myId: '',
  }

  componentDidMount() {
    const token = localStorage.getItem("token");
    axios({
      method: 'GET',
      url: `${api}/users/connectedUser`,
      headers: {
					 'Authorization': `Bearer ${token}`,
				 },
    })
    .then((results) => {
      this.setState({ user: results.data, myId: results.data.id });
      if (results.data.id !== this.props.id) {
        axios({
          method: 'POST',
          url: `${api}/users/getUserInfo`,
          data: {
            id: this.props.id,
          }
        })
        .then((results) =>{
          if (results.data.user) {
            this.setState({ user: results.data.user });
          } else {
            browserHistory.push('/app/homePage');
          }
        });
      };
    });
  };

  render(){
	  console.log("this.state", this.state);
    let lastSeen = '';
    if (this.state.user && this.state.user.lastSeen) {
      lastSeen = this.state.user.lastSeen.map((show, key) =>
        <ul key={key} className="seen"><li>{show}</li></ul>
      )
    }
    // tableau 5 derniers films vues et 5 dernieres series ?
    const { user, myId } = this.state;
    return (
		<div>
      {user && <div className="profile">
	  {user.picture && !user.provider && <img className="image" src={`http://localhost:8080/public/${user.picture}`} role="presentation" />}
      {user.picture && user.provider && <img className="image" src={user.picture} role="presentation" />}
      <div className="profileUsername">{user.username}</div>
        <div className="float">
          <div className="profileInfos"><i className="fa fa-user icons" aria-hidden="true"></i>{user.firstname} {user.lastname}</div>
          {this.props.id === myId && <div className="profileInfos"> <i className="fa fa-envelope icons" aria-hidden="true"></i> {user.email}</div>}
          <div className="profileInfos"><i className="fa fa-film icons" aria-hidden="true"></i>Last 10 movies/shows watched:</div>
          <div className="profileInfos">{lastSeen}</div>
        </div>
	</div>}
  </div>
    )
  }
}
