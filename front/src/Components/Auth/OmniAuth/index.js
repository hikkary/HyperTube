import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import apiURI from '../../../apiURI';
import axios from 'axios';
import './OmniAuth.sass';
import FBlogo from '../../../../public/fb-black.png';
import fortyTwoLogo from '../../../../public/42_logo.png';
import Glogo from '../../../../public/google_logo.png';
/* global FB */

export default class OmniAuth extends Component {
  componentDidMount() {
    window.fbAsyncInit = () => {
      FB.init({
        appId      : '1058421674304180',
        cookie     : true,  // enable cookies to allow the server to access
        xfbml      : true,  // parse social plugins on this page
        version    : 'v2.8' // use graph api version 2.8
      });
    }
  }

  statusChangeCallback = (response) => {
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
      // Logged into your app and Facebook.
      FB.api('/me?fields=email,first_name,last_name,picture', (response) => {
        axios({
          method: 'POST',
          url: `${apiURI}/users/facebook_auth`,
          data: response,
        }).then((data) => {
          console.log('data', data);
          if (data.data.status === true) {
            localStorage.setItem('token', data.headers['x-access-token']);
            browserHistory.push('/app/homePage');
          }
        })
      })
    } else if (response.status === 'not_authorized') {
      // The person is logged into Facebook, but not your app.
      console.error('ERROR FB');
    } else {
      // The person is not logged into Facebook, so we're not sure if
      // they are logged into this app or not.
      console.error('ERROR FB UNKNOWN');
    }
  }

// This function is called when someone finishes with the Login
// Button.  See the onlogin handler attached to it in the sample
// code below.
  checkLoginState = () => {
    FB.getLoginStatus((response) => {
      this.statusChangeCallback(response);
    });
  }

  handleClick = (e) => {
    FB.login(this.checkLoginState)
  }

  // gmail = () => {
  //   console.log('gmail');
  //   // axios authorize gmail
  // }

  render() {
    return(
      <div className="omniAuth">
        <a href="#" onClick={this.handleClick}><img src={FBlogo} role="presentation" className="fblogo" ></img></a>
        <a href='https://api.intra.42.fr/oauth/authorize?client_id=adb6d681ec4e26aa98abc4e9c5e8b809e721f88de9b6f6ed3dd7c3ee2f18dafa&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fapi%2Fusers%2F42_auth&response_type=code'>
          <img src={fortyTwoLogo} role="presentation" className="fortyTwoLogo" ></img></a>
          <a href="https://accounts.google.com/o/oauth2/auth?client_id=222912618974-s46u30prev1k9b88bflpo849thhqpfbv.apps.googleusercontent.com&response_type=code&scope=openid%20email&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fapi%2Fusers%2Fgmail_auth" onClick={this.gmail}><img src={Glogo} role="presentation" className="Glogo"></img></a>
      </div>
    )
  }
}
