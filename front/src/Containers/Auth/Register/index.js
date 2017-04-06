import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import allTheActions from '../../../Actions';
import title from '../../../../public/logo2.png';
import bg from '../../../../public/background-hypertube.png';
import Register from '../../../Components/Auth/Register';
import '../Welcome.sass';

const RegisterContainer = ({ user, actions, translation }) =>
  <div className="authContainer">
    <img src={title} role="presentation" className="logoTitle" />
      <div className="authBackground"
        style={{ backgroundImage: `url(${bg})` }}
      />
    <div className="authRegister">
      <Register user={user} actions={actions} translation={translation} />
    </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(RegisterContainer);
