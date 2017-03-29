import React 	from 'react';
import { connect } from 'react-redux';
import ChangePassword from '../../../Components/Auth/UpdatePassword';

const Update = ({ translation, user, id, username }) =>
	<div>
		<ChangePassword translation={translation} user={user} id={id} username={username} />
		</div>

const mapStateToProps = (state, ownProps) => ({
	translation: state.translation,
	user: state.user,
	id: ownProps.location.query.key,
	username: ownProps.location.query.username,
});

export default connect (mapStateToProps)(Update);
