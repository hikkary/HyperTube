import React, { Component } from 'react';
import axios from 'axios';
import api from '../../apiURI';

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
    const { user, myId } = this.state;
    return (
      <div className="profile">
        {user.username}
        {this.props.id === myId && user.email}
        {user.firstname}
        {user.lastname}
        {user.picture}
      </div>
    )
  }
}
