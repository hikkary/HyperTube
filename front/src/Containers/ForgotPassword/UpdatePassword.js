import React 	from 'react';
import axios from 'axios';
import api from '../../apiURI';
import {browserHistory}	from 'react-router';

export default class changePassword extends React.Component{

	componentDidMount = async () => {
}

submit = (event) => {
	event.preventDefault();
	 axios({
			method: 'POST',
			url : `${api}/users/updatePassword`,
			data : {
				username: this.props.location.query.username,
				key : this.props.location.query.key,
				password: event.target.password.value,
				newPass: event.target.newPass.value,
			}
	 })
	 .then((results) => {
     console.log(results);
		 console.log('Ok');
		 // FAIRE LA SUITE
	 })

}

	render() {
		return(
			<div className="auth">


			<div className="content">
				<form className="log-in-form" onSubmit={this.submit}>
					<input type="password" className="password" name="password" title="password" autoComplete="off" min="8" max="30" placeholder="Enter New Password"></input>
					<input type="password" className="newPass" name="newPass" title="newPass" autoComplete="off" min="8" max="30" placeholder="Confirm New Password"></input>
					<input className="forgotSubmit"
          type="submit"
          name="submit"
          value="Submit"
          />
				</form>
			</div>


			<div className="buttons">

		</div>
			</div>
		);
	}
}
