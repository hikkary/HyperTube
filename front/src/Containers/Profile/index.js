import React from 'react';
import Profile from '../../Components/Profile';
import { connect } from 'react-redux';

const ProfileContainer = ({ user, translation, id }) =>
  <Profile user={user} id={id} translation={translation} />

const mapStateToProps = (state, ownProps) => ({
  user: state.user,
  translation: state.translation,
  id: ownProps.params.id,
})

export default connect (mapStateToProps)(ProfileContainer);
