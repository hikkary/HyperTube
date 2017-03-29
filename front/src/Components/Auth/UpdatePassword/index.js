import React 	from 'react';
import axios from 'axios';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import api from '../../../apiURI';
import './sass/updatePassword.sass';

export default class ChangePassword extends React.Component{

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
		 // FAIRE LA SUITE
	 });
}

	render() {
		console.log(this.props);
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
              type="newPass"
              name="newPass"
              style={{
                width: '70%',
               }}/>
            <RaisedButton type="submit" label={current.submitPassword} style={{
              margin: '40px 0',
              width: '70%',
             }}/>
					</form>
				</div>
				<div className="buttons"></div>
			</div>
		)
	}
}
