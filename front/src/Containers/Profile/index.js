import React from 'react';
import Profile from '../../Components/Profile';
// import allTheActions from '../../Actions';
import { connect } from 'react-redux';
// import { bindActionCreators } from 'redux';

const ProfileContainer = ({ user, translation }) =>
  <div className="Profile">
    <Profile user={user} translation={translation} />
  </div>

const mapStateToProps = (state) => ({
  user: state.user,
  translation: state.translation,
})

export default connect (mapStateToProps)(ProfileContainer);
