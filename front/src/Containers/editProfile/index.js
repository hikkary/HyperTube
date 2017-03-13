import React from 'react';
import EditProfile from '../../Components/editProfile';
import { connect } from 'react-redux';
import Header from '../../Components/Header';
import { bindActionCreators } from 'redux';
import allTheActions from '../../Actions';

const ProfileContainer = ({ user, translation, actions }) =>
  <div className="Profile">
    <EditProfile user={user} translation={translation} actions={actions} />
  </div>

const mapStateToProps = (state, ownProps) => ({
  user: state.user,
  translation: state.translation,
})

const mapDispatchToProps = dispatch => ({
  actions: {
    user: bindActionCreators(allTheActions.user, dispatch),
  },
});

export default connect (mapStateToProps, mapDispatchToProps)(ProfileContainer);
