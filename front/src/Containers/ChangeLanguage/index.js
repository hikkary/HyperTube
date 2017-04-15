import React from 'react';
import ChangeLanguage from '../../Components/changeLanguage';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import allTheActions from '../../Actions';

const AuthProfile = ({ user, translation, actions }) =>
  <ChangeLanguage user={user} translation={translation} actions={actions} />

const mapStateToProps = (state) => ({
  user: state.user,
  translation: state.translation,
})

const mapDispatchToProps = dispatch => ({
  actions: {
    user: bindActionCreators(allTheActions.user, dispatch),
    translation: bindActionCreators(allTheActions.translation, dispatch),
  },
});

export default connect (mapStateToProps, mapDispatchToProps)(AuthProfile);
