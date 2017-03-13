import React from 'react';
import Profile from '../../Components/Profile';
// import allTheActions from '../../Actions';
import { connect } from 'react-redux';
import Header from '../../Components/Header'
// import { bindActionCreators } from 'redux';

const ProfileContainer = ({ user, translation, id }) =>
  <div className="Profile">
    <Profile user={user} id={id} translation={translation} />
  </div>

const mapStateToProps = (state, ownProps) => ({
  user: state.user,
  translation: state.translation,
  id: ownProps.params.id,
})

export default connect (mapStateToProps)(ProfileContainer);
