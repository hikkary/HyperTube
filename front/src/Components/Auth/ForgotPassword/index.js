import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import axios from 'axios';
import api from '../../../apiURI';
import './sass/forgotPassword.sass';

class ForgotPassword extends React.Component {
  state = {
    errors: '',
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
        if(results.data.errors)
        {
          this.setState({ errors: results.data.errors })
        }
        console.log(results);
      });
  }

  errorHandler = (error) => {
		const { translation } = this.props;
    console.log(translation);
		return translation.current[error];
	}

  render() {
    const { current } = this.props.translation;
    console.log('propsss', this.props);
    return (
      <div className="forgot">
        <div className="formCss">
          <div className="titleForgot">
            Forgot Your Password ?
          </div>
          <form className="formPass" onSubmit={this.forgotPassword}>
          {this.state.errors && <div className="error" style={{ margin: 'auto' }}>
    				{this.errorHandler(this.state.errors)}
    			</div>}
            <TextField
              floatingLabelText={current.enterUsername}
              type="text"
              name="username"
              style={{
                width: '60%',
               }}
            />
            <RaisedButton type="submit" name="submit" label={current.resetPassword}
              style={{
                width: '60%',
                marginTop: '50px'
              }}
            />
          </form>
        </div>
      </div>
    )
  }
}

export default ForgotPassword;
