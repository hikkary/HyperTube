import React, { Component } from 'react';
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
        console.log('ID ID ID ID');
        axios({
          method: 'POST',
          url: `${api}/users/getUserInfo`,
          data: {
            id: this.props.id,
          }
        })
        .then((results) =>{
          console.log('results', results);
          this.setState({ user: results.data.user });
        });
      };
    });
  };

  render(){
    // tableau 5 derniers films vues et 5 dernieres series ?
    const { user, myId } = this.state;
    return (
      <div className="profile">
      <img className="image" src={`http://localhost:8080/public/${user.picture}`} role="presentation" />
        <div className="float">
          <div className="profileInfos">{user.username}</div>
          <div className="profileInfos">{user.firstname} {user.lastname}</div>
          <div className="profileInfos">{this.props.id === myId && user.email}</div>
        </div>
      </div>
    )
  }
}
