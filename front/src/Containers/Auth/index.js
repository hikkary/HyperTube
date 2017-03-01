import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import allTheActions from '../../Actions';
import Register from '../../Components/Register';

const Auth = ({ users, actions }) =>
  <div>
    <Register users={users} actions={actions} />
  </div>

const mapStateToProps = (state) => ({
  users: state.users,  
});

const mapDispatchToProps = dispatch => ({
  actions: {
    users: bindActionCreators(allTheActions.users, dispatch)
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
