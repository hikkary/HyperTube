import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import axios from 'axios';
import api from '../../../apiURI';
import './sass/forgotPassword.sass';

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
            Forgot Your Password ?
          </div>
          <form className="formPass" onSubmit={this.forgotPassword}>
            <TextField
              floatingLabelText="Please enter your username"
              type="text"
              name="username"
              style={{
                width: '60%',

               }}
            />
            <RaisedButton type="submit" name="submit" label="RESET PASSWORD"
              style={{
                width: '60%',
                marginTop: '50px'
             }}
            />
          </form>
          <div className={this.state.err}>{this.state.error}</div>
        </div>
      </div>
    )
  }
}

export default forgotPassword;
