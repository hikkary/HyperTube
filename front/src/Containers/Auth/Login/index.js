import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import allTheActions from '../../../Actions';
import title from '../../../../public/logo2.png';
import bg from '../../../../public/background-hypertube.png';
import LoginForm from '../../../Components/Auth/Login';
import '../Welcome.sass';

const Login = ({ user, actions, translation, token }) =>
  <div className="authContainer">
    <img src={title} role="presentation" className="logoTitle" />
    <div className="authBackground"
      style={{ backgroundImage: `url(${bg})` }}
    />
    <div className="authLogin">
      <LoginForm user={user} actions={actions} token={token} translation={translation} />
    </div>
  </div>

const mapStateToProps = (state, ownProps) => ({
  user: state.user,
  translation: state.translation,
  token: ownProps.location.query.token,
});

const mapDispatchToProps = dispatch => ({
  actions: {
    user: bindActionCreators(allTheActions.user, dispatch),
    translation: bindActionCreators(allTheActions.translation, dispatch)
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
