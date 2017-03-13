import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import allTheActions from '../../Actions';
import SeriesDisplay from '../../Components/SeriesDisplay';
import Header from '../../Components/Header';

export const Series = ({ series, actions }) =>
  <div>
    <SeriesDisplay series={series} actions={actions} />
  </div>

Series.propTypes = {
  series: PropTypes.array.isRequired,
}

const mapStateToProps = (state) => ({
  series: state.series,
});

const mapDispatchToProps = dispatch => ({
  actions: {
    series: bindActionCreators(allTheActions.series, dispatch)
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Series);
