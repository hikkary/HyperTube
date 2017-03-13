import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import allTheActions from '../../Actions';
import Register from '../../Components/Register';
import bg from '../../../public/background-hypertube.jpg';
import title from '../../../public/logo.gif';

const RegisterContainer = ({ user, actions, translation }) =>
  <div className="authContainer">
    <img src={title} role="presentation" className="logoTitle" />
      <div className="authRegister">
        <div className="masterBG"
          style={{ backgroundImage: `url(${bg})` }}
        />
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
