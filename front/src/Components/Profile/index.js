import React, { Component } from 'react';

export default class Profile extends Component {
  state = {
    user: '',
  }

  componentDidMount() {
    const { user } = this.props;
    this.setState({ user: user.results.user });
  }

  render(){
    const { user } = this.state;
    return (
      <div>
        {user.username}
        {user.email}
        {user.firstname}
        {user.lastname}
        {user.picture}
      </div>
    )
  }
}
