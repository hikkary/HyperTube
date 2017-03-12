import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import allTheActions from '../../Actions';
import SeriePage from '../../Components/SeriePage';
import Header from '../../Components/Header';

const Series = ({ serie, translation, actions }) =>
  <div>
    <Header/>
    <SeriePage serie={serie} translation={translation} actions={actions} />
  </div>

const mapStateToProps = ({ serie , translation }) => ({ serie, translation });

const mapDispatchToProps = dispatch => ({
  actions: {
    serie: bindActionCreators(allTheActions.serie, dispatch),
    translation: bindActionCreators(allTheActions.translation, dispatch),
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Series);
