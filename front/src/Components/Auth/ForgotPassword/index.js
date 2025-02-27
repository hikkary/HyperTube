import React from 'react';
import { browserHistory } from 'react-router';
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
    success: '',
  }

  componentDidMount = () => {
    this._mounted = true;
    if (localStorage.getItem('token')) {
      browserHistory.push('/app/homePage');
    }
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  _mounted = false;

  goToPreviousPage = () => {
    browserHistory.push('/login');
  }

  forgotPassword = async (e) => {
    e.preventDefault();
      axios({
        method: 'POST',
        url: `${api}/users/forgotPassword`,
        data : {
          username: e.target.username.value,
        }
      })
      .then((results) => {
        if(results.data.errors) {
          if (!this._mounted) return false;
          this.setState({ errors: results.data.errors })
        }
        else {
          const { translation } = this.props;
          if (!this._mounted) return false;
          this.setState({ success: translation.current[results.data.success] });
        }
      });
  }

  errorHandler = (error) => {
		const { translation } = this.props;
		return translation.current[error];
	}

  render() {
    const { current } = this.props.translation;
    return (
      <div className="forgot">
        <div className="titleForgot">
          Forgot Your Password ?
        </div>
        <div className="goToPreviousPage"><i onClick={this.goToPreviousPage} className="fa fa-arrow-circle-left" aria-hidden="true"></i></div>
        <div className="formCss">
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
          <div className="success" style={{ margin: 'auto', marginTop: '20px' }}>{this.state.success}</div>
        </div>
      </div>
    )
  }
}

export default ForgotPassword;
