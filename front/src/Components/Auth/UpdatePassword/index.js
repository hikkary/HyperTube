import React 	from 'react';
import axios from 'axios';
import { browserHistory } from 'react-router';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import api from '../../../apiURI';
import './sass/updatePassword.sass';

export default class ChangePassword extends React.Component{
	state = {
		error: '',
	}

	componentDidMount = () => {
		if (localStorage.getItem('token')) {
			browserHistory.push('/app/homePage');
		}
	}

	submit = (event) => {
		event.preventDefault();
		 axios({
				method: 'POST',
				url : `${api}/users/updatePassword`,
				data : {
					username: this.props.username,
					key : this.props.id,
					password: event.target.password.value,
					newPass: event.target.newPass.value,
				}
		 })
		 .then((results) => {
			 if (results.data.status) {
				 browserHistory.push('/login');
			 } else {
				 this.setState({ error: results.data.errors });
				 // add message error of password
			 }
		 });
	}

	errorHandler = (error) => {
		const { translation } = this.props;
		return translation.current[error];
	}

	render() {
		const { current } = this.props.translation;
		return(
			<div className="updatePassword">
				<div className="updateFormCss">
          <div className="titleUpdate">
            {current.updatePassword}
          </div>
					<form className="updateForm" onSubmit={this.submit}>
            <TextField
              floatingLabelText={current.newPassword}
              type="password"
              name="password"
              style={{
                width: '70%',
               }}/>
            <TextField
              floatingLabelText={current.confirmPassword}
              type="password"
              name="newPass"
              style={{
                width: '70%',
               }}/>
            <RaisedButton type="submit" label={current.submitPassword} style={{
              margin: '40px 0',
              width: '70%',
             }}/>
					</form>
					{this.state.error && <div className="errorUpdate">
						{this.errorHandler(this.state.error)}
					</div>}
				</div>
				<div className="buttons"></div>
			</div>
		)
	}
}
