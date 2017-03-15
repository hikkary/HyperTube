import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import allTheActions from '../../Actions';
// import Register from '../../Components/Register';
import LoginForm from '../../Components/Login';
import title from '../../../public/logo2.png';
import bg from '../../../public/background-hypertube.jpg';
// import '../Welcome/Auth.sass';
// import OmniAuth from '../../Components/OmniAuth';

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
    // register: bindActionCreators(allTheActions.register, dispatch),
    user: bindActionCreators(allTheActions.user, dispatch),
    translation: bindActionCreators(allTheActions.translation, dispatch)
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
