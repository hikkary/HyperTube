import React from 'react';
import { connect } from 'react-redux';
import ForgotPassword from '../../../Components/Auth/ForgotPassword';
import title from '../../../../public/logo2.png';
import bg from '../../../../public/background-hypertube.png';
import '../Welcome.sass';

const Password = ({ translation, user }) =>
  <div className="authContainer">
    <img src={title} role="presentation" className="logoTitle" />
    <div className="authBackground"
      style={{ backgroundImage: `url(${bg})` }}
    />
    <div className="authForgotPassword">
      <ForgotPassword translation={translation} user={user} />
    </div>
  </div>

const mapStateToProps = (state) => ({
  translation: state.translation,
  user: state.user,
});

export default connect (mapStateToProps)(Password);
