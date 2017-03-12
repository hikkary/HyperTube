import React from 'react';
import axios from 'axios';
import { browserHistory } from 'react-router';
import api from '../../apiURI';
// import '../css/forgotPassword.css';

class forgotPassword extends React.Component {
  state = {
    error: '',
    status: '',
    err: 'err',
  }

  // hideError = (error) => {
    // return this.setState({ err: 'hidden_error' });
  // }

  forgotPassword = async (e) => {
    e.preventDefault();
      axios({
        method: 'POST',
        url: `${api}/users/forgotPassword`,
        data : {
          username: e.target.username.value
        }
      })
      .then((results) => {
        console.log(results);
      })


      // this.setState({ err: 'hidden_error' });
      // setTimeout(() => {
			// 		browserHistory.push('/resetPassword');
			// 	}, 2000);
  }

  render() {
    return (
      <div className="forgot">
      <div className="titleForgot">FORGOT YOUR PASSWORD ? </div>
        <form className="formPass" onSubmit={this.forgotPassword}>
          <input className="forgotInput"
          type="text"
          name="username"
          placeholder="Please enter your username"
          />
          <input className="forgotSubmit"
          type="submit"
          name="submit"
          value="Reset Password"
          />
        </form>
        <div className={this.state.err}>{this.state.error}</div>
      </div>
    )
  }
}

export default forgotPassword;
