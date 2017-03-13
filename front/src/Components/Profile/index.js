import React, { Component } from 'react';
import axios from 'axios';
import api from '../../apiURI'

export default class Profile extends Component {
  state = {
    user: '',
    loggedUser: '',
  }

  componentDidMount() {
    console.log(this.props.id);

    const token = localStorage.getItem("token");

    axios({
      method: 'GET',
      url: `${api}/users/connectedUser`,
      headers: {
					 'Authorization': 'Bearer '+token,
				 },
    })
    .then((results) => {
      this.setState({ user: results.data, myId: results.data.id });
      console.log('ID LOGGEDUSER', results.data.id);
      console.log('ID OTHER', this.props.id);
      if(results.data.id !== this.props.id) {
        console.log('eyeyeyeyeyeyeyeyeyeyeyyeyeyeeyeyeyeyeeyeyeye');
        axios({
          method: 'POST',
          url: `${api}/users/getUserInfo/`,
          data: {
            id: this.props.id,
          }
        })
        .then((results) =>{
          console.log("UTIIIIIILISATEUR",results)
          this.setState({user:results.data})
        })
      }
    })
  }

  render(){
    const { user, myId } = this.state;
    return (
      <div>
        {user.username}
        {this.props.id === myId && user.email}
        {user.firstname}
        {user.lastname}
        {user.picture}
      </div>
    )
  }
}
