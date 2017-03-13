import React from 'react';
import EditProfile from '../../Components/editProfile';
import { connect } from 'react-redux';
import Header from '../../Components/Header';

const ProfileContainer = ({ user, translation }) =>
  <div className="Profile">
    <EditProfile user={user} translation={translation} />
  </div>

const mapStateToProps = (state, ownProps) => ({
  user: state.user,
  translation: state.translation,
})

export default connect (mapStateToProps)(ProfileContainer);
