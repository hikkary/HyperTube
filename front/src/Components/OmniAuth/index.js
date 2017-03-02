import React, { Component } from 'react';

let FB = {};

export default class OmniAuth extends Component {
  testAPI = () => {
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', function(response) {
    console.log('Successful login for: ' + response.name);
    });
  };

  statusChangeCallback = (response) => {
    console.log('statusChangeCallback');
    console.log(response);
    if (response.status === 'connected') {
      this.testAPI();
    } else if (response.status === 'not_authorized') {
      console.log('NOT AUTHORIZED');
    } else {
      console.log('NOT IDK');
    }
  };

  checkLoginState = () => {
    FB.getLoginStatus(function(response) {
      this.statusChangeCallback(response);
    }.bind(this));
  };

  handleClick = () => {
    FB.login(this.checkLoginState());
  };

  render(){
    window.fbAsyncInit = function() {
      FB.init = () => ({
        appId      : '1058421674304180',
        cookie     : true,
        xfbml      : true,
        version    : 'v2.8'
      });
      FB.AppEvents.logPageView();
    };

    (function(d, s, id){
       var js, fjs = d.getElementsByTagName(s)[0];
       if (d.getElementById(id)) {return;}
       js = d.createElement(s); js.id = id;
       js.src = "//connect.facebook.net/en_US/sdk.js";
       fjs.parentNode.insertBefore(js, fjs);
     }(document, 'script', 'facebook-jssdk'));

    return(
      <div>
        <a href="#" onClick={this.handleClick}>FACEBOOK</a>
      </div>
    )
  }
}
