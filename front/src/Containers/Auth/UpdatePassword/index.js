import React 	from 'react';
import { connect } from 'react-redux';
import ChangePassword from '../../../Components/Auth/UpdatePassword';

const Update = ({ translation, user, key, username }) => {
	console.log(key);
	<div>
		<ChangePassword translation={translation} user={user} key={key} username={username} />
		</div>
}

const mapStateToProps = (state, ownProps) => ({
	translation: state.translation,
	user: state.user,
	key: ownProps.params.key,
	username: ownProps.location.query.username,
});

export default connect (mapStateToProps)(Update);
