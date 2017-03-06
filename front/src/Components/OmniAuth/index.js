import React, { Component } from 'react';
import apiURI from '../../apiURI';
import axios from 'axios';
import { uid, secret } from './secret42';
import popup from './popup42';
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

    // VERIFIE LE CODE ENVOYER APRES LA CONNEXION VIA 42, DOIT LECHANGER CONTRE UN TOKEN
    // MAIS SA BUG
    // if(window.location.search){
    //   let code = window.location.search.split('=')
    //   console.log(code[1]);
    //   // alert('ok');
    //   axios({
    //     method: 'POST',
    //     url: 'https://api.intra.42.fr/oauth/token',
    //     data:{
    //       grant_type: 'authorization_code',
    //       client_id: uid,
    //       client_secret: secret,
    //       code: code[1],
    //     }
    //   })
    //   .then((response) =>{
    //     console.log(response);
    //   })
    //
    // }
  }

  statusChangeCallback = (response) => {
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
      // Logged into your app and Facebook.
      FB.api('/me?fields=email,first_name,last_name,picture', (response) => {
        console.log('response', JSON.stringify(response));
        console.log('response', response);
        axios({
          method: 'POST',
          url: `${apiURI}/users/facebook_auth`,
          data: response,
        }).then((data) => {

        })
      })
    } else if (response.status === 'not_authorized') {
      // The person is logged into Facebook, but not your app.
      console.error('ERROR FB')
    } else {
      // The person is not logged into Facebook, so we're not sure if
      // they are logged into this app or not.
      console.error('ERROR FB UNKNOWN')
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



  // handleAuthorize42 = (e) => {
  //
  //   //FAIT UNE REQUETE A LAPI 42, SI TOUT EST OK ON LANCE LA FENETRE POUR SE CO
  //   axios.get(`${apiURI}/users/42_auth`)
  //   .then((response, err) =>{
  //     if (err) {
  //       console.log(err)
  //       return
  //     }
  //     console.log(response);
  //     window.open('https://api.intra.42.fr/oauth/authorize?client_id=540af455e551d8238c17215920325a8a350b087bf1762bc51f34339956719cfa&redirect_uri=http://localhost:3000&response_type=code&scope=public')
  //   })
  //
  // }

  render() {
    return(
      <div>
        <a href="#" onClick={this.handleClick}>FACEBOOK</a>
        <a href='#' onClick={this.handleAuthorize42}>42</a>
      </div>
    )
  }
}


// handle42 = (e) => {
//   axios({
//     method: 'POST',
//     url : 'https://api.intra.42.fr/oauth/token',
//     data: {
//       grant_type:'client_credentials',
//       client_id: uid,
//       client_secret: secret,
//     }})
//     .then((response) =>{
//       console.log(response
//       );
//       // response.get('/me')
//     //   axios({
//     //     headers: {
// 		// 		 'Authorization': 'Bearer '+response.data.access_token,
// 		// 	 },
//     //     method: 'POST',
//     //     url : 'https://api.intra.42.fr/v2/me',
//      //
//     //  })
//     //  .then((response) => {
//     //    console.log(response);
//     //  })
//     })
// }
