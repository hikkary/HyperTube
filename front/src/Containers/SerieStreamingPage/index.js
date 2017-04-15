import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import allTheActions from '../../Actions';
import SerieStreamingPage from '../../Components/SerieStreamingPage';

const SerieStreaming = ({ serie, translation, actions, id, user, serieId }) =>
  <div>
    <SerieStreamingPage user={user} serie={serie} serieId={serieId} id={id} translation={translation} actions={actions} />
  </div>

const mapStateToProps = (state, ownProps) => ({
  translation: state.translation,
  id: ownProps.params.id,
  serieId: ownProps.params.serieId,
  serie: state.serie,
  user: state.user,
});

const mapDispatchToProps = dispatch => ({
  actions: {
    serie: bindActionCreators(allTheActions.serie, dispatch),
    user: bindActionCreators(allTheActions.user, dispatch),
    translation: bindActionCreators(allTheActions.translation, dispatch),
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(SerieStreaming);
