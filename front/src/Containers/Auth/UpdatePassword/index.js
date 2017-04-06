import React 	from 'react';
import { connect } from 'react-redux';
import ChangePassword from '../../../Components/Auth/UpdatePassword';
import title from '../../../../public/logo2.png';
import bg from '../../../../public/background-hypertube.png';
import '../Welcome.sass';

const Update = ({ translation, user, id, username }) =>
	<div className="authContainer">
		<img src={title} role="presentation" className="logoTitle" />
			<div className="authBackground"
				style={{ backgroundImage: `url(${bg})` }}
			/>
		<div className="authForgotPassword">
			<ChangePassword translation={translation} user={user} id={id} username={username} />
			</div>
	</div>

const mapStateToProps = (state, ownProps) => ({
	translation: state.translation,
	user: state.user,
	id: ownProps.location.query.key,
	username: ownProps.location.query.username,
});

export default connect (mapStateToProps)(Update);
