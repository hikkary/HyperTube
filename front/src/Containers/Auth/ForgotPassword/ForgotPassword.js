import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import axios from 'axios';
import api from '../../../apiURI';
import './forgotPassword.sass';

class forgotPassword extends React.Component {
  state = {
    error: '',
    status: '',
    err: 'err',
  }

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
        //add message
        console.log(results);
      });
  }

  render() {
    return (
      <div className="forgot">
        <div className="formCss">
          <div className="titleForgot">
            FORGOT YOUR PASSWORD ?
          </div>
          <form className="formPass" onSubmit={this.forgotPassword}>
            <input className="forgotInput"
              type="text"
              name="username"
              placeholder="Please enter your username"
            />
            <RaisedButton type="submit" name="submit" label="RESET PASSWORD"/>
          </form>
          <div className={this.state.err}>{this.state.error}</div>
        </div>
      </div>
    )
  }
}

export default forgotPassword;
