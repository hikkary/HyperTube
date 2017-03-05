import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import allTheActions from '../../Actions';
import Register from '../../Components/Register';
import Login from '../../Components/Login';
import bg from '../../../public/background-hypertube.jpg';
import './Auth.sass'
import OmniAuth from '../../Components/OmniAuth';

const Auth = ({ users, actions, translation }) =>
  <div className="auth">
    <OmniAuth />
    <div className="masterBG"
      style={{ backgroundImage: `url(${bg})` }}
    />
    <Register users={users} actions={actions} translation={translation} />
    <Login users={users} actions={actions} translation={translation} />
  </div>
const mapStateToProps = (state) => ({
  users: state.users,
  translation: state.translation,
});

const mapDispatchToProps = dispatch => ({
  actions: {
    register: bindActionCreators(allTheActions.register, dispatch),
    login: bindActionCreators(allTheActions.login, dispatch),
    translation: bindActionCreators(allTheActions.translation, dispatch)
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
