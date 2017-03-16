import React 	from 'react';
import axios from 'axios';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import api from '../../../apiURI';
import './updatePassword.sass';

export default class changePassword extends React.Component{

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
		return(
			<div className="updatePassword">
				<div className="updateFormCss">
          <div className="titleUpdate">
            FORGOT YOUR PASSWORD ?
          </div>
					<form className="updateForm" onSubmit={this.submit}>
            <TextField
              floatingLabelText="Enter New Password"
              type="password"
              name="password"
              style={{
                width: '70%',
               }}/>
            <TextField
              floatingLabelText="Confirm New Password"
              type="newPass"
              name="newPass"
              style={{
                width: '70%',
               }}/>

            <RaisedButton type="submit" label="Change PASSWORD" style={{
              margin: '20px 0',
              width: '70%',
             }}/>
					</form>
				</div>
				<div className="buttons"></div>
			</div>
		)
	}
}
