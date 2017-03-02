import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import allTheActions from '../../Actions';
import Register from '../../Components/Register';
import Login from '../../Components/Login';
// import OmniAuth from '../../Components/OmniAuth';

const Auth = ({ users, actions }) =>
  <div>
    {/* <OmniAuth /> */}
    <Register users={users} actions={actions} />
    <Login users={users} actions={actions} />
  </div>

const mapStateToProps = (state) => ({
  users: state.users,
});

const mapDispatchToProps = dispatch => ({
  actions: {
    register: bindActionCreators(allTheActions.register, dispatch),
    login: bindActionCreators(allTheActions.login, dispatch)
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
