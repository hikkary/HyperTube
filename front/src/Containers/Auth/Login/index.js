import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import allTheActions from '../../../Actions';
import LoginForm from '../../../Components/Auth/Login';

const Login = ({ user, actions, translation }) =>
  <div className="authLogin">
    <LoginForm user={user} actions={actions} translation={translation} />
  </div>
  
const mapStateToProps = (state) => ({
  user: state.user,
  translation: state.translation,
});

const mapDispatchToProps = dispatch => ({
  actions: {
    user: bindActionCreators(allTheActions.user, dispatch),
    translation: bindActionCreators(allTheActions.translation, dispatch)
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
