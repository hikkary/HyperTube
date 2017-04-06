import React from 'react';
import { connect } from 'react-redux';
import ForgotPassword from '../../../Components/Auth/ForgotPassword';

const Password = ({ translation, user }) =>
  <div className="authForgotPassword">
    <ForgotPassword translation={translation} user={user} />
  </div>

const mapStateToProps = (state) => ({
  translation: state.translation,
  user: state.user,
});

export default connect (mapStateToProps)(Password);
