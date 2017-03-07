import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import allTheActions from '../../Actions';
import Register from '../../Components/Register';
import bg from '../../../public/background-hypertube.jpg';
import title from '../../../public/logo.gif';

const Auth = ({ users, actions, translation }) =>
  <div className="authContainer">
    <img src={title} role="presentation" className="logoTitle" />
      <div className="authRegister">
        <div className="masterBG"
          style={{ backgroundImage: `url(${bg})` }}
        />
        <Register users={users} actions={actions} translation={translation} />
      </div>
  </div>
const mapStateToProps = (state) => ({
  users: state.users,
  translation: state.translation,
});

const mapDispatchToProps = dispatch => ({
  actions: {
    register: bindActionCreators(allTheActions.register, dispatch),
    translation: bindActionCreators(allTheActions.translation, dispatch)
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
