import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import allTheActions from '../../Actions';
import SeriesDisplay from '../../Components/SeriesDisplay';

export const Series = ({ series, actions, translation }) =>
  <div>
    <SeriesDisplay translation={translation} series={series} actions={actions} />
  </div>

Series.propTypes = {
  series: PropTypes.array.isRequired,
}

const mapStateToProps = (state) => ({
  series: state.series,
  translation: state.translation,
});

const mapDispatchToProps = dispatch => ({
  actions: {
    series: bindActionCreators(allTheActions.series, dispatch)
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Series);
